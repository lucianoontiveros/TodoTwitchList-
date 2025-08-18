import React, { useEffect, useState, useRef, useCallback, memo } from "react";
import client from "./data/controllerClientTwitch/clientTwitch.js";

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
  const maxReconnectAttempts = 5;

  // Manejador de mensajes memoizado
  const handleMessage = useCallback((channel, tags, message, self) => {
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

  // Manejador de reconexión
  const handleReconnect = useCallback(() => {
    if (reconnectAttempts.current < maxReconnectAttempts) {
      reconnectAttempts.current += 1;
      console.log(
        `Intento de reconexión ${reconnectAttempts.current}/${maxReconnectAttempts}`
      );

      setTimeout(() => {
        client.connect().catch((err) => {
          console.error("Error en la reconexión:", err);
          setConnectionStatus("error");
        });
      }, Math.min(1000 * Math.pow(2, reconnectAttempts.current), 3000));
    } else {
      setConnectionStatus("max_attempts_reached");
      console.error("Máximo número de intentos de reconexión alcanzado");
    }
  }, []);

  useEffect(() => {
    // Configurar manejadores de eventos del cliente
    const setupClientHandlers = () => {
      client.on("message", handleMessage);

      client.on("connected", () => {
        setConnectionStatus("connected");
        reconnectAttempts.current = 0;
      });

      client.on("disconnected", () => {
        setConnectionStatus("disconnected");
        handleReconnect();
      });

      client.on("error", (err) => {
        console.error("Error en la conexión:", err);
        setConnectionStatus("error");
      });
    };

    // Iniciar conexión
    setupClientHandlers();
    client.connect().catch((err) => {
      console.error("Error en la conexión inicial:", err);
      setConnectionStatus("error");
      handleReconnect();
    });

    // Limpieza
    return () => {
      client.removeListener("message", handleMessage);
      client.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleMessage, handleReconnect]);

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
