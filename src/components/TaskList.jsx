import React, { useState, useEffect } from "react";

const TaskList = () => {
  const [users, setUsers] = useState([]); // Almacena todos los usuarios

  const [currentUserIndex, setCurrentUserIndex] = useState(0); // Índice del usuario actual

  // Función para obtener los usuarios de localStorage
  const fetchUsers = () => {
    const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
    const usersArray = Object.values(storedUsers); // Convertir el objeto en un array
    setUsers(usersArray);
  };

  // Efecto para cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Efecto para cambiar de usuario cada 10 segundos
  useEffect(() => {
    if (users.length > 0) {
      const interval = setInterval(() => {
        setCurrentUserIndex((prevIndex) => (prevIndex + 1) % users.length); // Avanza al siguiente usuario
      }, 10000); // Cambia cada 10 segundos

      return () => clearInterval(interval); // Limpiar el intervalo al desmontar
    }
  }, [users]); // Dependencia: users

  // Si no hay usuarios, mostrar un mensaje
  if (users.length === 0) {
    return <p>No hay usuarios registrados.</p>;
  }

  // Obtener el usuario actual
  const currentUser = users[currentUserIndex];

  return (
    <div
      style={{
        border: "1px solid #ccc",
        padding: "10px",
        margin: "10px 0",
        width: "50%",
      }}
    >
      <h2>Usuario: {currentUser.name}</h2>
      <p>ID: {currentUser._id}</p>
      <p>Estado: {currentUser.status}</p>
      <p>Última vez activo: {currentUser.lastTime}</p>

      <h3>Datos Personales:</h3>
      {currentUser.personaldata.length > 0 ? (
        <ul>
          {currentUser.personaldata.map((data, i) => (
            <li key={i}>
              <p>Signo: {data.sign}</p>
              <p>Puntos: {data.points}</p>
              <p>Nacionalidad: {data.nationality}</p>
              <p>Fecha de Nacimiento: {data.birth}</p>
              <p>Instagram: {data.instagram}</p>
              <p>Oposición: {data.oppositionfor}</p>
              <p>Estudio: {data.studyfor}</p>
              <p>Croquetas Totales: {data.croquetastotal}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay datos personales registrados.</p>
      )}

      <h3>Tareas:</h3>
      {currentUser.tasks.length > 0 ? (
        <ul>
          {currentUser.tasks.map((task, i) => (
            <li key={i}>
              <p>Descripción: {task.description}</p>
              <p>ID: {task._id}</p>
              <p>Activa: {task.active ? "Sí" : "No"}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay tareas registradas.</p>
      )}

      <h3>Exámenes:</h3>
      {currentUser.exams.length > 0 ? (
        <ul>
          {currentUser.exams.map((exam, i) => (
            <li key={i}>
              <p>Fecha: {exam.dateExam}</p>
              <p>Tipo: {exam.typeExam}</p>
              <p>
                Título: {exam.titleExam} ID: {exam._id}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay exámenes registrados.</p>
      )}
    </div>
  );
};

export default TaskList;
