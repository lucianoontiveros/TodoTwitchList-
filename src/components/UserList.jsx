import React, { useEffect, useState, useRef, useCallback } from "react";
import { registrationUsers } from "../data/LocalStorage/controllerLocalStorage";
import UserList_component from "./UserList_component/UserList_component";

const UserList = () => {
  const DISPLAY_TIME = 15000; // 15 segundos para mejor visualización
  const [users, setUsers] = useState([]);
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const intervalRef = useRef(null);
  const userListRef = useRef([]);

  // Función memoizada para cargar usuarios
  const loadUsers = useCallback(() => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
      const userList = Object.keys(storedUsers)
        .map((username) => ({
          username,
          ...storedUsers[username],
        }))
        .filter(user => user.tasks && user.tasks.length > 0); // Solo mostrar usuarios con tareas

      userListRef.current = userList;
      setUsers(userList);

      // Reiniciar el índice si está fuera de rango
      if (currentUserIndex >= userList.length) {
        setCurrentUserIndex(0);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  }, [currentUserIndex]);

  // Función memoizada para iniciar el intervalo
  const startInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    if (userListRef.current.length <= 1) return; // No iniciar intervalo si hay 0 o 1 usuario

    intervalRef.current = setInterval(() => {
      setCurrentUserIndex(prevIndex => {
        const nextIndex = (prevIndex + 1) % userListRef.current.length;
        return userListRef.current.length > 0 ? nextIndex : 0;
      });
    }, DISPLAY_TIME);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadUsers();
    const cleanup = startInterval();

    // Evento para manejar cambios en localStorage
    const handleStorageChange = (e) => {
      if (e.key === 'users') {
        loadUsers();
        startInterval(); // Reiniciar el intervalo cuando cambian los usuarios
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      cleanup?.();
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [loadUsers, startInterval]);

  // Si no hay usuarios con tareas, mostrar mensaje
  if (users.length === 0) {
    return <div className="no-users">No hay usuarios con tareas pendientes.</div>;
  }

  // Obtener el usuario actual
  const currentUser = users[currentUserIndex];

  return <UserList_component currentUser={currentUser} />;
};

export default UserList;
