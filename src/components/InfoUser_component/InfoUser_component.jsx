import React, { useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username, tagsClases }) => {
  const [clases, setClases] = useState({
    title:
      "mb-2  font-normal text-5xl font-weight: 500; text-center text-white",
    subtitle: "font-normal text-3xl text-center  text-purple-400",
    style:
      "flex items-center p-3 text-base font-bold bg-black text-purple-500 rounded-lg",
    container: "",
  });
  console.log(tagsClases);

  switch (tagsClases) {
    case "sub":
      setClases((prevClases) => ({
        ...prevClases,
        title:
          "mb-2 font-bold text-4xl text-center tracking-tight text-purple-500",
        subtitle: "font-normal text-3xl text-center text-purple-300",
        style:
          "flex items-center p-3 text-base font-bold bg-black text-purple-400 ",
        container:
          "flex flex-wrap items-center text-xl text-purple-300 p-3 font-bold sus_fondo bg-transparente rounde ",
      }));
      break;
    case "vip":
      setClases((prevClases) => ({
        ...prevClases,
        title:
          "mb-2 font-bold text-4xl text-center tracking-tight text-pink-600",
        subtitle: "font-normal text-3xl text-center text-pink-400",
        style:
          "flex items-center p-3 text-base font-bold bg-black text-pink-500 ",
        container:
          "flex flex-wrap items-center text-xl text-indigo-100 p-3 vip_fondo bg-transparente rounde",
      }));
      break;
    case "mod":
      setClases((prevClases) => ({
        ...prevClases,
        title:
          "mb-2 font-bold text-4xl text-center tracking-tight text-green-400",
        subtitle: "font-normal text-3xl text-center text-green-300",
        style:
          "flex items-center p-3 text-base font-bold bg-black text-green-300 ",
        container:
          "flex flex-wrap items-center text-xl text-green-100 p-3 font-bold mod_fondo bg-transparente rounde",
      }));
      break;
    case "prime":
      setClases((prevClases) => ({
        ...prevClases,
        title:
          "mb-2 font-bold text-4xl text-center tracking-tight text-blue-600",
        subtitle: "font-normal text-3xl text-center text-blue-700",
        style:
          "flex items-center p-3 text-base font-bold bg-black text-blue-400 rounded-lg",
        container:
          "flex flex-wrap items-center text-xl text-blue-400 p-3 prime_fondo font-bold bg-transparente rounde",
      }));
      break;
    default:
      setClases((prevClases) => ({
        ...prevClases,
        title:
          "mb-2  font-normal text-4xl font-weight: 500; text-center text-white my-4",
        subtitle: "font-normal text-3xl text-center text-white",
        style: "flex items-center p-3 text-base font-bold bg-black text-white ",
        container:
          "flex flex-wrap items-center text-xl text-white p-3 font-bold viewer bg-transparente rounde ",
      }));
  }

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
