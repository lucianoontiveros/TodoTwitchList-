import React, { useState, useEffect, useCallback, memo } from "react";
import InfoUser_component from "./InfoUser_component/InfoUser_component";

const InfoUser = memo(({ username }) => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  // Función memoizada para obtener los datos del usuario
  const fetchUserData = useCallback(() => {
    if (!username) return;

    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
      const userData = storedUsers[username];

      if (!userData) {
        console.warn(`No se encontraron datos para el usuario: ${username}`);
        setError("Usuario no encontrado");
        setUser(null);
        return;
      }

      setUser(userData);
      setError(null);
    } catch (err) {
      console.error("Error al obtener datos del usuario:", err);
      setError("Error al cargar datos");
      setUser(null);
    }
  }, [username]);

  useEffect(() => {
    // Cargar datos iniciales
    fetchUserData();

    // Configurar listeners para cambios
    const handleStorageChange = (event) => {
      if (event.key === "users") {
        fetchUserData();
      }
    };

    const handleUserUpdate = () => fetchUserData();

    // Suscribirse a eventos
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("usersUpdated", handleUserUpdate);

    // Limpieza de eventos
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usersUpdated", handleUserUpdate);
    };
  }, [fetchUserData]);

  // Manejo de estados de error y carga
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!user) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <InfoUser_component
      user={user}
      username={username}
    />
  );
});

InfoUser.displayName = "InfoUser";

export default InfoUser;
