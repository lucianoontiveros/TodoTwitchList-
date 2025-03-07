import React, { useEffect, useState, useRef } from "react";
import UserList_component from "./UserList_component/UserList_component";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const intervalRef = useRef(null);

  // Función para cargar usuarios desde localStorage
  const loadUsers = () => {
    try {
      if (typeof window === "undefined") return; // Evita errores en el servidor

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
      setCurrentUserIndex(0);
    } catch (error) {
      console.error("Error al cargar usuarios desde localStorage:", error);
    }
  };

  // Cargar usuarios al iniciar
  useEffect(() => {
    loadUsers();
  }, []);

  // Escuchar cambios en localStorage (solo en el cliente)
  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("storage", loadUsers);
    return () => {
      window.removeEventListener("storage", loadUsers);
    };
  }, []);

  // Rotación de usuarios cada 6 segundos
  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (users.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length);
      }, 6000);
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
