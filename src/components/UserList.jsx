import React, { useEffect, useState } from "react";
import { registrationUsers } from "../data/LocalStorage/controllerLocalStorage";
import UserList_component from "./UserList_component/UserList_component";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Índice del usuario actual

  useEffect(() => {
    // Obtener los usuarios del localStorage
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    const userList = Object.keys(storedUsers).map((username) => ({
      username,
      ...storedUsers[username],
    }));
    setUsers(userList);

    // Configurar un intervalo para cambiar el usuario cada 5 segundos
    const interval = setInterval(() => {
      setCurrentUserIndex((prevIndex) => (prevIndex + 1) % userList.length); // Avanza al siguiente usuario
    }, 5000); // 5000 ms = 5 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval);
  }, []);

  // Si no hay usuarios, mostrar un mensaje
  if (users.length === 0) {
    return <div>No hay usuarios registrados.</div>;
  }

  // Obtener el usuario actual
  const currentUser = users[currentUserIndex];

  return <UserList_component currentUser={currentUser} />;
};

export default UserList;
