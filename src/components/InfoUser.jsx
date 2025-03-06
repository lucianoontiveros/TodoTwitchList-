import React, { useState, useEffect } from "react";
import InfoUser_component from "./InfoUser_component/InfoUser_component";

const InfoUser = ({ username }) => {
  const [user, setUser] = useState("");

  // Función para obtener los datos del usuario desde localStorage
  const fetchUserData = () => {
    try {
      if (!username) return;

      const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
      setUser(storedUsers[username] || "");
    } catch (error) {
      console.error(
        "Error al obtener datos del usuario desde localStorage:",
        error
      );
      setUser(""); // Evita que se quede un estado corrupto
    }
  };

  useEffect(() => {
    fetchUserData(); // Cargar datos al montar el componente

    // Escuchar cambios en localStorage desde otras pestañas
    const handleStorageChange = (event) => {
      if (event.key === "users") {
        fetchUserData();
      }
    };

    // Escuchar cambios en la misma pestaña mediante un evento personalizado
    const handleUserUpdate = () => fetchUserData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("usersUpdated", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usersUpdated", handleUserUpdate);
    };
  }, [username]);

  if (!user) return null;

  return (
    <InfoUser_component
      user={user}
      username={username}
    />
  );
};

export default InfoUser;
