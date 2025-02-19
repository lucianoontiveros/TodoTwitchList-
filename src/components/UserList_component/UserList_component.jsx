import React, { useEffect, useState } from "react";
import TaskList_component from "../Tasklist_component/TaskList_component";

const UserList_component = ({ currentUser }) => {
  const [styleUsers, setStyleUsers] = useState({
    title:
      "mb-2  font-normal text-4xl font-weight: 500; text-center text-white my-4",
    subtitle: "font-normal text-3xl text-center text-white",
    style: "flex items-center p-3 text-base font-bold bg-black text-white ",
    container:
      "flex flex-wrap items-center text-xl text-white p-3 font-bold viewer bg-transparente rounde ",
  });
  useEffect(() => {
    switch (currentUser.tag) {
      case "sub":
        setStyleUsers((prevClases) => ({
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
        setStyleUsers((prevClases) => ({
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
        setStyleUsers((prevClases) => ({
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
        setStyleUsers((prevClases) => ({
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
        setStyleUsers((prevClases) => ({
          ...prevClases,
          title:
            "mb-2  font-normal text-4xl font-weight: 500; text-center text-white my-4",
          subtitle: "font-normal text-3xl text-center text-white",
          style:
            "flex items-center p-3 text-base font-bold bg-black text-white ",
          container:
            "flex flex-wrap items-center text-xl text-white p-3 font-bold viewer bg-transparente rounde ",
        }));
    }
  }, []);

  return (
    <div className={styleUsers.container}>
      <h2>Mostrando usuario cada 5 segundos</h2>
      <div>
        <strong>Usuario: {currentUser.username}</strong>
        <p>ID: {currentUser._id}</p>
        <p>
          Última conexión: {new Date(currentUser.lastTime).toLocaleString()}
        </p>
        <p>Tareas: {currentUser.tasks.length}</p>
        <p>Exámenes: {currentUser.exams.length}</p>
        <TaskList_component user={currentUser} />
      </div>
    </div>
  );
};

export default UserList_component;
