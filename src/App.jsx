import React, { useEffect, useState, useRef } from "react";
import client from "./data/controllerClientTwitch/clientTwitch.js";

// Importación de componentes
import UserList from "./components/UserList";
import InfoUser from "./components/InfoUser";

// Importación de utilidades
import { monitorMessage } from "./utils/monitorMessage";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isInfoUserVisible, setIsInfoUserVisible] = useState(false);
  const prevUser = useRef(null);
  const timeoutRef = useRef(null);

  // 🔹 Maneja la conexión con Twitch al montar
  useEffect(() => {
    const connectClient = async () => {
      if (!client.connection || !client.connection.connected) {
        try {
          await client.connect();
          console.log("✅ Conectado a Twitch");
        } catch (err) {
          console.error("❌ Error al conectar con Twitch:", err);
        }
      }
    };

    connectClient(); // Intenta conectar

    return () => {
      if (client.connection && client.connection.connected) {
        client.disconnect();
        console.log("🔌 Desconectado de Twitch");
      }
    };
  }, []);

  // 🔹 Maneja la reconexión si se desconecta
  useEffect(() => {
    const reconnect = async () => {
      console.warn("⚠ Cliente desconectado. Intentando reconectar...");
      setTimeout(async () => {
        try {
          await client.connect();
          console.log("🔄 Reconectado a Twitch");
        } catch (err) {
          console.error("❌ Error al reconectar:", err);
        }
      }, 5000);
    };

    client.on("disconnected", reconnect);

    return () => {
      client.off("disconnected", reconnect);
    };
  }, []);

  // 🔹 Manejo de mensajes de Twitch
  useEffect(() => {
    const handleMessage = (channel, tags, message, self) => {
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
        console.error("❌ Error al procesar el mensaje:", err);
      }
    };

    client.on("message", handleMessage);

    return () => {
      client.off("message", handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {isInfoUserVisible && currentUser ? (
        <InfoUser username={currentUser} />
      ) : (
        <UserList />
      )}
    </>
  );
};

export default App;
