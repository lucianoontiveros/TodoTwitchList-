import React from "react";

const InfoUser_component = ({ user, username }) => {
  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>Información completa de {username}</h3>
      <p>ID: {user._id}</p>
      <p>Última conexión: {new Date(user.lastTime).toLocaleString()}</p>
      <p>Tareas: {user.tasks.length}</p>
      <ul>
        {user.tasks.map((task, index) => {
          const taskStatus = task.completed ? "Completada" : "Pendiente";
          return (
            <li key={index}>
              <strong>Tarea {index + 1}:</strong> {task.description} -{" "}
              {taskStatus}
            </li>
          );
        })}
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

export default InfoUser_component;
