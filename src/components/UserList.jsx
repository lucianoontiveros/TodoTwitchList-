import React, { useEffect, useState, useRef } from "react";
import { registrationUsers } from "../data/LocalStorage/controllerLocalStorage";
import UserList_component from "./UserList_component/UserList_component";

const UserList = () => {
  const [users, setUsers] = useState([]); // Lista de usuarios
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Índice del usuario actual
  const intervalRef = useRef(null); // Referencia para el intervalo

  useEffect(() => {
    try {
      const storedUsers = localStorage.getItem("users");
      if (!storedUsers) return; // Si no hay datos, salir

      const parsedUsers = JSON.parse(storedUsers);
      if (typeof parsedUsers !== "object" || parsedUsers === null) return; // Validación extra

      const userList = Object.keys(parsedUsers).map((username) => ({
        username,
        ...parsedUsers[username],
      }));

      if (userList.length === 0) return; // Evita configurar estado innecesariamente

      setUsers(userList);

      if (userList.length === 1) return; // No configurar intervalo si hay solo un usuario

      intervalRef.current = setInterval(() => {
        setCurrentUserIndex((prevIndex) => (prevIndex + 1) % userList.length);
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } catch (error) {
      console.error("Error al cargar usuarios desde localStorage:", error);
    }
  }, []);

  if (users.length === 0) {
    return <div>No hay usuarios registrados.</div>;
  }

  return <UserList_component currentUser={users[currentUserIndex]} />;
};

export default UserList;
