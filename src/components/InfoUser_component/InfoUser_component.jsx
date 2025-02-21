import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({
    title:
      "mb-2  font-normal text-4xl font-weight: 500; text-center text-white ",
    subtitle: "font-normal text-3xl text-center text-white",
    style: " text-base font-bold bg-black text-white ",
    container: " text-xl text-white  font-bold viewer  rounded ",
  });
  useEffect(() => {
    switch (user.tag) {
      case "sub":
        setClases((prevClases) => ({
          ...prevClases,
          title:
            " font-bold text-4xl text-center tracking-tight text-purple-500",
          subtitle: "font-normal text-3xl text-center text-purple-300",
          style: " text-base font-bold bg-black text-purple-400 ",
          container: " text-xl text-purple-300  font-bold sus_fondo  rounded ",
        }));
        break;
      case "vip":
        setClases((prevClases) => ({
          ...prevClases,
          title: " font-bold text-4xl text-center tracking-tight text-pink-600",
          subtitle: "font-normal text-3xl text-center text-pink-400",
          style: " text-base font-bold bg-black text-pink-500 ",
          container: " text-xl text-indigo-100  vip_fondo  rounded",
        }));
        break;
      case "mod":
        setClases((prevClases) => ({
          ...prevClases,
          title:
            " font-bold text-4xl text-center tracking-tight text-green-400",
          subtitle: "font-normal text-3xl text-center text-green-300",
          style: " text-base font-bold bg-black text-green-300 ",
          container: " text-xl text-green-100  font-bold mod_fondo  rounded",
        }));
        break;
      case "prime":
        setClases((prevClases) => ({
          ...prevClases,
          title: " font-bold text-4xl text-center tracking-tight text-blue-600",
          subtitle: "font-normal text-3xl text-center text-blue-700",
          style: " text-base font-bold bg-black text-blue-400 rounded-lg",
          container: " text-xl text-blue-400  prime_fondo font-bold  rounded",
        }));
        break;
      default:
        setClases((prevClases) => ({
          ...prevClases,
          title:
            "  font-normal text-4xl font-weight: 500; text-center text-white ",
          subtitle: "font-normal text-3xl text-center text-white",
          style: " text-base font-bold bg-black text-white ",
          container: " text-xl text-white  font-bold viewer  rounde ",
        }));
    }
  }, []);

  return (
    <div className="maincontainer">
      <div className={clases.container}>
        <div>
          <h2 className={clases.title}>{username}</h2>
        </div>
        <div>
          <p>Última conexión: {new Date(user.lastTime).toLocaleString()}</p>
          <p>Exámenes: {user.exams.length}</p>
          <p>
            Instagram: {user.personaldata[0]?.instagram || "No especificado"}
          </p>
          <p>
            Nacionalidad:{" "}
            {user.personaldata[0]?.nationality || "No especificada"}
          </p>
          <p>
            Fecha de nacimiento:{" "}
            {user.personaldata[0]?.birth || "No especificada"}
          </p>
          <p>
            Signo zodiacal: {user.personaldata[0]?.sign || "No especificado"}
          </p>
          <p className={clases.subtitle}>Tareas: {user.tasks.length}</p>
        </div>
        <Tasklist_component user={user} />
        <p>ID: {user._id}</p>
      </div>
    </div>
  );
};

export default InfoUser_component;
