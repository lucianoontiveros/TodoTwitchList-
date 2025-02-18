import React, { useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({
    title:
      "mb-2  font-normal text-5xl font-weight: 500; text-center text-white",
    subtitle: "font-normal text-3xl text-center  text-purple-400",
    style:
      "flex items-center p-3 text-base font-bold bg-black text-purple-500 rounded-lg",
    container: "",
  });

  return (
    <div
      style={{ border: "1px solid #ccc", padding: "10px", margin: "10px 0" }}
    >
      <h3>Información completa de {username}</h3>
      <p>ID: {user._id}</p>
      <p>Última conexión: {new Date(user.lastTime).toLocaleString()}</p>
      <p>Tareas: {user.tasks.length}</p>
      <Tasklist_component user={user} />
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
