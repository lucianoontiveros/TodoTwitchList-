import React, { useEffect, useState, useRef } from "react";

// Importación de cliente de Twitch
import client from "./data/controllerClientTwitch/clientTwitch.js";

// Importación de componentes
import UserList from "./components/UserList";
import InfoUser from "./components/InfoUser";

// Importación de utilidades
import { monitorMessage } from "./utils/monitorMessage"; // Importamos la función modularizada

const App = () => {
  const [currentUser, setCurrentUser] = useState(null); // Usuario actual mostrado en InfoUser
  const [isInfoUserVisible, setIsInfoUserVisible] = useState(false); // Estado de visibilidad de InfoUser
  const prevUser = useRef(null); // Almacena el último usuario que ingresó un comando
  const timeoutRef = useRef(null); // Referencia al temporizador para reiniciarlo

  // Conectar el cliente de Twitch al montar el componente
  useEffect(() => {
    if (!client.readyState || client.readyState() !== "OPEN") {
      // Validación de conexión
      try {
        client.connect();
      } catch (err) {
        console.error("Error al conectar con Twitch:", err);
      }
    }

    return () => {
      if (client.readyState && client.readyState() === "OPEN") {
        client.disconnect(); // Desconectar al desmontar
      }
    };
  }, []);

  // Manejo de mensajes de Twitch
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
        console.error("Error al procesar el mensaje:", err);
      }
    };

    client.on("message", handleMessage);

    return () => {
      client.removeListener("message", handleMessage);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Limpiar el temporizador de forma segura
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
