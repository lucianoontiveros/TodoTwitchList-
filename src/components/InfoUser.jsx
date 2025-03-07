import React, { useState, useEffect, useRef } from "react";
import InfoUser_component from "./InfoUser_component/InfoUser_component";

const InfoUser = ({ username }) => {
  const [user, setUser] = useState(null);
  const userUpdateRef = useRef(null); // Referencia para el eventListener

  // Función para obtener los datos del usuario desde localStorage
  const fetchUserData = () => {
    try {
      if (!username) {
        setUser(null);
        return;
      }

      const storedUsers = localStorage.getItem("users");
      if (!storedUsers) {
        setUser(null);
        return;
      }

      const parsedUsers = JSON.parse(storedUsers);
      if (typeof parsedUsers !== "object" || parsedUsers === null) {
        setUser(null);
        return;
      }

      setUser(parsedUsers[username] || null);
    } catch (error) {
      console.error(
        "Error al obtener datos del usuario desde localStorage:",
        error
      );
      setUser(null);
    }
  };

  useEffect(() => {
    fetchUserData(); // Cargar datos al montar el componente

    const handleStorageChange = (event) => {
      if (event.key === "users") fetchUserData();
    };

    userUpdateRef.current = () => fetchUserData();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("usersUpdated", userUpdateRef.current);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      if (userUpdateRef.current) {
        window.removeEventListener("usersUpdated", userUpdateRef.current);
      }
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
