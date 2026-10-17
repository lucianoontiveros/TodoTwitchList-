import React, { useEffect, useState, useRef, memo } from "react";
import { getTwitchClient } from "./data/controllerClientTwitch/clientTwitch.js";

// Importación de componentes
import UserList from "./components/UserList";
import InfoUser from "./components/InfoUser";

// Importación de utilidades
import { monitorMessage } from "./utils/monitorMessage";

const App = memo(() => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInfoUserVisible, setIsInfoUserVisible] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("connecting");
  
  const prevUser = useRef(null);
  const timeoutRef = useRef(null);
  const messageHandlerRef = useRef(null);

  // Obtener instancia única del cliente
  const twitchClient = getTwitchClient();

  useEffect(() => {
    let isMounted = true;

    // handler real que usa monitorMessage (usa refs desde closure)
    const handleMessageInternal = (channel, tags, message, self) => {
      if (self) return;
      try {
        monitorMessage(
          channel,
          tags,
          message,
          self,
          prevUser,
          timeoutRef,
          setIsInfoUserVisible,
          setCurrentUser
        );
      } catch (err) {
        console.error("Error al procesar el mensaje:", err);
      }
    };

    // Registrar handlers *una sola vez* y dejar que persistan entre reconexiones.
    // Guardamos la referencia en messageHandlerRef para poder comprobar si ya existe.
    if (!messageHandlerRef.current) {
      messageHandlerRef.current = handleMessageInternal;
    }

    // Si no está registrado en el client, registrarlo.
    try {
      // registrar 'message' (idempotente si controlamos hasMessage flag)
      if (twitchClient && twitchClient.client) {
        // Aseguramos no duplicar: comprobamos listeners actuales
        const existing = twitchClient.client.listeners
          ? twitchClient.client.listeners("message") || []
          : [];

        const alreadyRegistered = existing.includes(messageHandlerRef.current);

        if (!alreadyRegistered) {
          twitchClient.client.on("message", messageHandlerRef.current);
          console.log("Handler 'message' registrado en cliente (setup inicial).");
        } else {
          console.log("Handler 'message' ya estaba registrado.");
        }
      }
    } catch (e) {
      console.warn("No se pudo comprobar listeners existentes:", e);
      // registramos de todas formas (evita quedarse sin handler)
      try {
        twitchClient.client.on("message", messageHandlerRef.current);
        console.log("Handler 'message' registrado (fallback).");
      } catch (err) {
        console.error("Fallo registrando handler message:", err);
      }
    }

    // Conectados / desconectados / error
    const connectedHandler = () => {
      if (!isMounted) return;
      console.log("Evento connected recibido");
      setConnectionStatus("connected");

      // Si por alguna razón el handler message se perdió, lo re-adjuntamos
      try {
        const existing = twitchClient.client.listeners
          ? twitchClient.client.listeners("message") || []
          : [];
        if (!existing.includes(messageHandlerRef.current)) {
          twitchClient.client.on("message", messageHandlerRef.current);
          console.log("Re-registrado handler 'message' tras connected");
        }
      } catch (err) {
        console.error("Error re-registrando handler en connected:", err);
      }
    };

    const disconnectedHandler = () => {
      if (!isMounted) return;
      console.log("Evento disconnected recibido");
      setConnectionStatus("reconnecting");
    };

    const reconnectHandler = () => {
      if (!isMounted) return;
      console.log("Reconectando con Twitch...");
      setConnectionStatus("reconnecting");
    };

    const maxReconnectHandler = () => {
      if (!isMounted) return;
      console.error("Se alcanzó el máximo de intentos de reconexión de Twitch");
      setConnectionStatus("error");
    };

    const errorHandler = (err) => {
      if (!isMounted) return;
      console.error("Error en la conexión:", err);
    };

    // Registrar handlers de conexión (si no están ya)
    // Evitamos duplicar con listeners(...) chequeos
    try {
      const hasConnected = twitchClient.client.listeners
        ? twitchClient.client.listeners("connected").includes(connectedHandler)
        : false;
      if (!hasConnected) twitchClient.client.on("connected", connectedHandler);

      const hasDisconnected = twitchClient.client.listeners
        ? twitchClient.client.listeners("disconnected").includes(disconnectedHandler)
        : false;
      if (!hasDisconnected) twitchClient.client.on("disconnected", disconnectedHandler);

      const hasReconnect = twitchClient.client.listeners
        ? twitchClient.client.listeners("reconnect").includes(reconnectHandler)
        : false;
      if (!hasReconnect) twitchClient.client.on("reconnect", reconnectHandler);

      const hasMaxReconnect = twitchClient.client.listeners
        ? twitchClient.client.listeners("maxreconnect").includes(maxReconnectHandler)
        : false;
      if (!hasMaxReconnect) twitchClient.client.on("maxreconnect", maxReconnectHandler);

      const hasError = twitchClient.client.listeners
        ? twitchClient.client.listeners("error").includes(errorHandler)
        : false;
      if (!hasError) twitchClient.client.on("error", errorHandler);
    } catch (err) {
      console.warn("No se pudo comprobar listeners existentes:", err);
      // Si listeners() no está implementado en la versión, registramos sin checks
      twitchClient.client.on("connected", connectedHandler);
      twitchClient.client.on("disconnected", disconnectedHandler);
      twitchClient.client.on("reconnect", reconnectHandler);
      twitchClient.client.on("maxreconnect", maxReconnectHandler);
      twitchClient.client.on("error", errorHandler);
    }

    // tmi.js owns retries after the initial connection attempt.
    twitchClient.client.connect().catch((err) => {
      if (!isMounted) return;
      console.error("Error en la conexión inicial:", err);
      setConnectionStatus("reconnecting");
    });

    return () => {
      isMounted = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      try {
        twitchClient.client.removeListener("connected", connectedHandler);
        twitchClient.client.removeListener("disconnected", disconnectedHandler);
        twitchClient.client.removeListener("reconnect", reconnectHandler);
        twitchClient.client.removeListener("maxreconnect", maxReconnectHandler);
        twitchClient.client.removeListener("error", errorHandler);
      } catch (err) {
        console.warn("Error removiendo handlers en cleanup:", err);
      }
    };
  }, [twitchClient]);

  // Renderizado condicional basado en el estado de conexión
  if (connectionStatus === "error") {
    return (
      <div className="connection-error">
        <h2>Error de conexión</h2>
        <p>No se pudo restablecer la conexión con Twitch.</p>
      </div>
    );
  }

  return (
    <>
      {connectionStatus === "connecting" && (
        <div className="connecting">Conectando con Twitch...</div>
      )}
      {connectionStatus === "reconnecting" && (
        <div className="connecting">
          Conexión con Twitch interrumpida. Reintentando automáticamente...
        </div>
      )}
      {connectionStatus === "connected" &&
        (isInfoUserVisible && currentUser ? (
          <InfoUser username={currentUser} />
        ) : (
          <UserList />
        ))}
    </>
  );
});

App.displayName = "App";

export default App;