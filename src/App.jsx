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

  // Limpiar todos los timeouts y reconexiones
  const cleanupAll = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (messageHandlerRef.current && twitchClient.client) {
      twitchClient.client.removeListener("message", messageHandlerRef.current);
    }
  }, [twitchClient]);

  // Manejador de reconexión con mejor control
  const handleReconnect = useCallback(() => {
    cleanupAll();
    
    if (reconnectAttempts.current >= maxReconnectAttempts) {
      setConnectionStatus("max_attempts_reached");
      console.error("Máximo número de intentos de reconexión alcanzado");
      return;
    }

    reconnectAttempts.current += 1;
    console.log(`Intento de reconexión ${reconnectAttempts.current}/${maxReconnectAttempts}`);

    reconnectTimeoutRef.current = setTimeout(() => {
      twitchClient.client.connect().catch((err) => {
        console.error("Error en la reconexión:", err);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          handleReconnect();
        } else {
          setConnectionStatus("error");
        }
      });
    }, Math.min(3000 * reconnectAttempts.current, 10000));
  }, [cleanupAll, twitchClient]);

  useEffect(() => {
    let isMounted = true;

    const setupClientHandlers = () => {
      // Registrar handler una sola vez
      messageHandlerRef.current = handleMessage;
      twitchClient.client.on("message", messageHandlerRef.current);

      const connectedHandler = () => {
        if (!isMounted) return;
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
      };

      const disconnectedHandler = () => {
        if (!isMounted) return;
        setConnectionStatus("disconnected");
        handleReconnect();
      };

      const errorHandler = (err) => {
        if (!isMounted) return;
        console.error("Error en la conexión:", err);
        setConnectionStatus("error");
      };

      twitchClient.client.on("connected", connectedHandler);
      twitchClient.client.on("disconnected", disconnectedHandler);
      twitchClient.client.on("error", errorHandler);

      // Retornar funciones de limpieza
      return () => {
        twitchClient.client.removeListener("connected", connectedHandler);
        twitchClient.client.removeListener("disconnected", disconnectedHandler);
        twitchClient.client.removeListener("error", errorHandler);
      };
    };

    // Iniciar conexión
    const cleanupHandlers = setupClientHandlers();
    
    twitchClient.client.connect().catch((err) => {
      if (!isMounted) return;
      console.error("Error en la conexión inicial:", err);
      setConnectionStatus("error");
      handleReconnect();
    });

    // Limpieza completa al desmontar
    return () => {
      isMounted = false;
      cleanupAll();
      cleanupHandlers();
      twitchClient.disconnect();
    };
  }, [handleMessage, handleReconnect, cleanupAll, twitchClient]);

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