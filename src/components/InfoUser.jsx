import React, { useState, useEffect } from "react";

const InfoUser = ({ username }) => {
  const [user, setUser] = useState(null);

  const fetchUserData = () => {
    if (username) {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
      const userData = storedUsers[username];
      if (userData) {
        setUser(userData);
      }
    }
  };

  // Efecto para obtener los datos iniciales del usuario
  useEffect(() => {
    fetchUserData();
  }, [username]);

  // Efecto para escuchar cambios en localStorage
  useEffect(() => {
    const interval = setInterval(() => {
      fetchUserData(); // Actualizar los datos cada segundo (o el tiempo que desees)
      console.log("Estoy revisando el localstorage");
    }, 1000); // 1000 ms = 1 segundo

    return () => clearInterval(interval); // Limpiar el intervalo al desmontar
  }, [username]);

  if (!user) {
    return null; // No mostrar nada si no hay usuario
  }

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>Información completa de {username}</h3>
      <p>ID: {user._id}</p>
      <p>Última conexión: {new Date(user.lastTime).toLocaleString()}</p>
      <p>Tareas: {user.tasks.length}</p>
      <ul>
        {user.tasks.map((task, index) => (
          <li key={index}>
            <strong>Tarea {index + 1}:</strong> {task.description} -{" "}
            {task.completed ? "Completada" : "Pendiente"}
          </li>
        ))}
      </ul>
      <p>Exámenes: {user.exams.length}</p>
      <p>Instagram: {user.personaldata[0]?.instagram || "No especificado"}</p>
      <p>
        Nacionalidad: {user.personaldata[0]?.nationality || "No especificada"}
      </p>
      <p>
        Fecha de nacimiento: {user.personaldata[0]?.birth || "No especificada"}
      </p>
      <p>Signo zodiacal: {user.personaldata[0]?.sign || "No especificado"}</p>
    </div>
  );
};

export default InfoUser;
