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

  // 🔹 Manejo de mensajes de Twitch
  useEffect(() => {
    client.connect();

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
      client.disconnect();
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
