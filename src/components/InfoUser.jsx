import React, { useState, useEffect } from "react";
import InfoUser_component from "./InfoUser_component/InfoUser_component";

const InfoUser = ({ username }) => {
  const [user, setUser] = useState("");

  const fetchUserData = () => {
    if (username) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
      const userData = storedUsers[username];
      if (userData) {
        setUser(userData);
      }
    }
  };

  // Efecto para escuchar cambios en localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData(); // Actualizar los datos cada segundo (o el tiempo que desees)
      console.log("Estoy revisando el localstorage");
    }, 1000); // 1000 ms = 1 segundo

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, []);

  if (!user) {
    return null; // No mostrar nada si no hay usuario
  }

  return (
    <InfoUser_component
      user={user}
      username={username}
    />
  );
};

export default InfoUser;
