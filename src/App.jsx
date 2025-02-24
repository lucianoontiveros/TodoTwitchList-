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

  // Conectar el cliente de Twitch y manejar comandos
  useEffect(() => {
    client.connect();

    const handleMessage = (channel, tags, message, self) => {
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
    };

    client.on("message", handleMessage);
    return () => {
      client.removeListener("message", handleMessage);
      clearTimeout(timeoutRef.current); // Limpiamos el temporizador al desmontar
    };
  }, []);

  return (
    <>
      {isInfoUserVisible && <InfoUser username={currentUser} />}
      {!isInfoUserVisible && <UserList />}
    </>
  );
};

export default App;

