import React, { useEffect, useState, useRef } from "react";

// Importación de funcionalidades
import {
  foundOrCreateUser,
  deleteUser,
  verifyIdUser,
  changeNameUser,
  deleteInactiveUsersTwoMonths,
} from "./data/controllerUsers/controllerUsers";

import {
  addTaskUser,
  reviewListTaskUser,
  readyTaskUser,
  deleteTaskUser,
  modifyTaskUser,
  deleteAllListTaskUser,
  readyListAllListUser,
} from "./data/controllerProperties/controllerTasks";

import {
  addExam,
  deleteExam,
  reviewExam,
  deleteAllExams,
} from "./data/controllerProperties/controllerExams";

import {
  getUserInfo,
  addDataNationality,
  addBirth,
  addInstagram,
  addOppositionfor,
  addStudyFor,
  giveCroquetas,
} from "./data/controllerProperties/controllerPersonalData";

// Importación de cliente de Twitch
import client from "./data/controllerClientTwitch/clientTwitch.js";

// Importaciones de utilidad con el localStorage
import jsonData from "./data/localStorageData.json";

import {
  loadLocalStorageFromFile,
  saveLocalStorageFile,
} from "./data/LocalStorage/controllerLocalStorage";

// Importación de componentes
import UserList from "./components/UserList";
import InfoUser from "./components/InfoUser";

const App = () => {
  const [currentUser, setCurrentUser] = useState(null); // Usuario actual mostrado en InfoUser
  const [isInfoUserVisible, setIsInfoUserVisible] = useState(false); // Estado de visibilidad de InfoUser
  const prevUser = useRef(null); // Almacena el último usuario que ingresó un comando
  const timeoutRef = useRef(null); // Referencia al temporizador para reiniciarlo
  const [tagUser, setTagUser] = useState(null);

  // Conectar el cliente de Twitch y manejar comandos
  useEffect(() => {
    client.connect();

    const handleMessage = (channel, tags, message, self) => {
      if (self || !message.startsWith("!")) return;
      const username = tags.username;
      console.log(tags);

      // Si el mismo usuario ingresa otro comando, extendemos el tiempo de visibilidad
      if (prevUser.current === username) {
        clearTimeout(timeoutRef.current); // Cancelamos el temporizador anterior
        timeoutRef.current = setTimeout(() => {
          setIsInfoUserVisible(false);
          setCurrentUser(null);
        }, 5000); // Solo extendemos 5 segundos más
      } else {
        // Si es un nuevo usuario, iniciamos el temporizador estándar
        prevUser.current = username;
        clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
          setIsInfoUserVisible(false);
          setCurrentUser(null);
        }, 10000);
      }

      const isSub = tags.badges?.subscriber;
      const isVip = tags.badges?.vip;
      const isMod = tags.badges?.moderator;
      const isPrime = tags.badges?.premium;
      const tagsClases =
        (isSub ? "sub" : "") ||
        (isVip ? "vip" : "") ||
        (isMod ? "mod" : "") ||
        (isPrime ? "prime" : "");
      console.log(tagsClases);

      // promps que extraemos del comando
      const command = message.toLowerCase().split(" ")[0].slice(1);
      const args = message.slice(1).split(" ");
      const arg = args[1];
      const otherUsername = message.slice(7);
      const taskLowercase = message.substring(command.length + 1);
      const task =
        taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(1);
      const taskMod =
        taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(4);

      // Manejo de comandos
      switch (command) {
        // Administrar usuarios
        case "id?":
          verifyIdUser(channel, arg);
          break;
        case "eliminarusuario":
          deleteUser(channel, username, arg);
          break;
        case "cambiarusuario":
          if (username === "cuartodechenz") {
            changeNameUser(channel, arg, username);
          }
          break;

        // Administrar tareas
        case "tarea":
        case "add":
          addTaskUser(username, task, channel);
          break;
        case "lista":
        case "list":
          reviewListTaskUser(username, channel);
          break;
        case "v":
        case "marcar":
        case "check":
          readyTaskUser(username, arg, channel);
          break;
        case "x":
        case "eliminar":
        case "borrar":
        case "delete":
          deleteTaskUser(username, arg, channel);
          break;
        case "modificar":
          modifyTaskUser(username, arg, taskMod, channel);
          break;
        case "clear":
          deleteAllListTaskUser(username, channel);
          break;
        case "pickup":
          readyListAllListUser(username, channel);
          break;

        //Administrar información personal de usuarios
        case "nacimiento":
          addBirth(username, arg, channel);
          break;
        case "instagram":
          addInstagram(username, arg, channel);
          break;
        case "opositopara":
          addOppositionfor(username, task, channel);
          break;
        case "estudiopara":
          addStudyFor(username, task, channel);
          break;
        case "croqueta":
          giveCroquetas(username, channel);
          break;
        case "nacionalidad":
          addDataNationality(username, task, channel);
          break;
        case "datos":
          getUserInfo(username, channel);
          break;
        case "info":
          getUserInfo(otherUsername, channel);
          break;

        // Administrar lista de examenes
        case "addexam":
          addExam(username, task, channel);
          break;
        case "examdelete":
          deleteExam(username, arg, channel);
          break;
        case "reviewexam":
          reviewExam(username, channel);
          break;
        case "deleteallexam":
          deleteAllExams(username, channel);
          break;

        // Administrar lista de examenes
        case "guardar":
          saveLocalStorageFile();
          break;
        case "cargar":
          loadLocalStorageFromFile(jsonData);
          break;
        default:
          return;
      }
      setCurrentUser(username);
      setTagUser(tagsClases);
      setIsInfoUserVisible(true);
      deleteInactiveUsersTwoMonths();
    };

    client.on("message", handleMessage);
    return () => {
      client.removeListener("message", handleMessage);
      clearTimeout(timeoutRef.current); // Limpiamos el temporizador al desmontar
    };
  }, []);

  return (
    <>
      {isInfoUserVisible && (
        <InfoUser
          username={currentUser}
          tagsClases={tagUser}
        />
      )}
      {!isInfoUserVisible && <UserList />}
    </>
  );
};

export default App;
