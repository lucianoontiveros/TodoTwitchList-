import React, { useEffect, useState } from "react";

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
import TaskList from "./components/TaskList";
import InfoUser from "./components/InfoUser";
import UserList from "./components/UserList";

const App = () => {
  client.connect();

  client.on("message", (channel, tags, message, self) => {
    // Ignore echoed mesages.
    if (self) return;
    if (!message.startsWith("-")) return;

    // nombre de usuario y sus propiedades
    var username = tags.username;
    const isSub = tags.badges?.subscriber;
    const isPrime = tags.badges?.premium;
    const isVip = tags.badges?.vip;
    const isMod = tags.badges?.moderator;
    const badgesClases =
      (isPrime ? "prime" : "") ||
      (isVip ? "vip" : "") ||
      (isSub ? "sub" : "") ||
      (isMod ? "mod" : "");

    // Informacion que ingresa el usuario
    const command = message.toLowerCase().split(" ")[0].slice(1);
    const args = message.slice(1).split(" ");
    const arg = args[1];
    const otherUsername = message.slice(7);
    const taskLowercase = message.substring(command.length + 1);
    const task = taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(1);
    const taskMod =
      taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(4);

    // Funcionalidad para identificar usuario y gestionarlo
    console.log(command);
    switch (command) {
      //comandos de usaurio.
      case "id?":
        verifyIdUser(channel, arg);
        break;
      case "eliminarusuario":
        deleteUser(channel, username, arg);
        break;
      case "cambiarusuario":
        if (username == "cuartodechenz") {
          changeNameUser(channel, arg, username);
        }
        break;

      // comandos para minipular tareas
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
      case "mod":
        modifyTaskUser(username, arg, taskMod, channel);
        break;
      case "clear":
        deleteAllListTaskUser(username, channel);
        break;
      case "pickup":
        readyListAllListUser(username, channel);
        break;

      // comandos para gestionar personal
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
      case "croquetas":
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

      // registrar examenes
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

      // gestionar localStorage
      case "guardar":
        saveLocalStorageFile();
        break;
      case "cargar":
        loadLocalStorageFromFile(jsonData);
        break;
    }

    deleteInactiveUsersTwoMonths();
  });
  return (
    <>
      <TaskList />
      <InfoUser />
      <UserList />
    </>
  );
};

export default App;
