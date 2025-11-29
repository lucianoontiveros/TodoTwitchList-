import React, { useEffect, useState, useRef, useCallback, memo } from "react";
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
  const reconnectAttempts = useRef(0);
  const messageHandlerRef = useRef(null);
  const maxReconnectAttempts = 3;
  const reconnectTimeoutRef = useRef(null);

  // Obtener instancia única del cliente
  const twitchClient = getTwitchClient();

    useEffect(() => {
    const REFRESH_TIME_MINUTES = 30; // Cambialo: 5, 10, 15...
    console.log("Me ejecute");
    const interval = setInterval(() => {
      console.log("Auto-refresh OBS source");
      window.location.reload();
    }, REFRESH_TIME_MINUTES * 60 * 1000);

    return () => clearInterval(interval);
    }, []); 

  // Manejador de mensajes memoizado
  const handleMessage = useCallback((channel, tags, message, self) => {
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
  }, []);

  // ------------------ REEMPLAZAR cleanupAll ------------------
  // Limpiar todos los timeouts y reconexiones (NO remover el listener "message")
  const cleanupAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    // << NO remover el listener "message" aquí >> 
    // removing the message listener here causes the bot to become "sordo"
  }, []); // ya no depende de twitchClient

  // ------------------ REEMPLAZAR handleReconnect ------------------
  // Manejador de reconexión con mejor control (no borra listener)
  const handleReconnect = useCallback(() => {
    // solo limpiar timeouts, no remover listeners
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setConnectionStatus("max_attempts_reached");
      console.error("Máximo número de intentos de reconexión alcanzado");
      return;
    }

    reconnectAttempts.current += 1;
    console.log(`Intento de reconexión ${reconnectAttempts.current}/${maxReconnectAttempts}`);

    // Intentamos reconectar. Si connect falla, volvemos a intentar.
    reconnectTimeoutRef.current = setTimeout(async () => {
      try {
        await twitchClient.client.connect();
        console.log("Reconexión: connect() resuelta");
        // cuando se conecte, el evento 'connected' (registrado más abajo) se encargará de
        // setear estado y (si hace falta) volver a asegurar el message handler.
      } catch (err) {
        console.error("Error en la reconexión:", err);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          handleReconnect();
        } else {
          setConnectionStatus("error");
        }
      }
    }, Math.min(3000 * reconnectAttempts.current, 10000));
  }, [twitchClient]);


  // ------------------ REEMPLAZAR useEffect principal (registrar handlers UNA vez) ------------------

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
      reconnectAttempts.current = 0;

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
      setConnectionStatus("disconnected");
      // No removemos el handler aquí: lo mantenemos y lo reasignamos al reconectar
      handleReconnect();
    };

    const errorHandler = (err) => {
      if (!isMounted) return;
      console.error("Error en la conexión:", err);
      setConnectionStatus("error");
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

      const hasError = twitchClient.client.listeners
        ? twitchClient.client.listeners("error").includes(errorHandler)
        : false;
      if (!hasError) twitchClient.client.on("error", errorHandler);
    } catch (err) {
      // Si listeners() no está implementado en la versión, registramos sin checks
      twitchClient.client.on("connected", connectedHandler);
      twitchClient.client.on("disconnected", disconnectedHandler);
      twitchClient.client.on("error", errorHandler);
    }

    // Intentamos conectar (si es necesario)
    twitchClient.client.connect().catch((err) => {
      if (!isMounted) return;
      console.error("Error en la conexión inicial:", err);
      setConnectionStatus("error");
      handleReconnect();
    });

    // Cleanup al desmontar el componente (no removemos message handler)
    return () => {
      isMounted = false;
      // limpiar timeouts/reconnects
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      // Quitamos solo los handlers de conexión (connected/disconnected/error)
      try {
        twitchClient.client.removeListener("connected", connectedHandler);
        twitchClient.client.removeListener("disconnected", disconnectedHandler);
        twitchClient.client.removeListener("error", errorHandler);
      } catch (err) {
        console.warn("Error removiendo handlers en cleanup:", err);
      }
      // NO llamar twitchClient.disconnect() aquí para no "matar" la instancia global si hay refreshs del DOM.
    };
  }, [twitchClient, handleReconnect]);

  // Renderizado condicional basado en el estado de conexión
  if (
    connectionStatus === "error" ||
    connectionStatus === "max_attempts_reached"
  ) {
    return (
      <div className="connection-error">
        <h2>Error de conexión</h2>
        <p>
          {connectionStatus === "max_attempts_reached"
            ? "No se pudo reconectar después de múltiples intentos"
            : "Error en la conexión con Twitch"}
        </p>
      </div>
    );
  }

  return (
    <>
      {connectionStatus === "connecting" && (
        <div className="connecting">Conectando con Twitch...</div>
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