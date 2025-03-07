import React, { useEffect, useState, useRef } from "react";
import UserList_component from "./UserList_component/UserList_component";

const UserList = () => {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Índice del usuario actual
  const intervalRef = useRef(null); // Referencia para el intervalo

  useEffect(() => {
    const loadUsers = () => {
      try {
        const storedUsers = localStorage.getItem("users");
        if (!storedUsers) {
          console.log("No hay usuarios en localStorage");
          setUsers([]);
          return;
        }

        const parsedUsers = JSON.parse(storedUsers);
        if (!parsedUsers || typeof parsedUsers !== "object") {
          console.log("Usuarios inválidos en localStorage");
          setUsers([]);
          return;
        }

        const userList = Object.keys(parsedUsers).map((username) => ({
          username,
          ...parsedUsers[username],
        }));

        console.log("Usuarios cargados:", userList);

        setUsers(userList);
        setCurrentUserIndex(0); // Reiniciar índice
      } catch (error) {
        console.error("Error al cargar usuarios desde localStorage:", error);
      }
    };

    loadUsers(); // Cargar usuarios al iniciar

    // Escuchar cambios en localStorage (opcional si otros componentes lo modifican)
    window.addEventListener("storage", loadUsers);

    return () => {
      window.removeEventListener("storage", loadUsers);
    };
  }, []);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (users.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
      }, 500);
    } else {
      setCurrentUserIndex(0);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [users]);

  if (users.length === 0) {
    return <div>No hay usuarios registrados.</div>;
  }

  return <UserList_component currentUser={users[currentUserIndex]} />;
};

export default UserList;
