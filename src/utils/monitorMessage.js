import { handleTimer } from "./handleTimer";
import { validateCommand } from "./validateCommand";

import {
  foundOrCreateUser,
  deleteUser,
  verifyIdUser,
  changeNameUser,
  deleteInactiveUsersTwoMonths,
} from "../data/controllerUsers/controllerUsers";

import {
  addTaskUser,
  reviewListTaskUser,
  readyTaskUser,
  deleteTaskUser,
  modifyTaskUser,
  deleteAllListTaskUser,
  readyListAllListUser,
} from "../data/controllerProperties/controllerTasks";

import {
  addExam,
  deleteExam,
  reviewExam,
  deleteAllExams,
} from "../data/controllerProperties/controllerExams";

import {
  getUserInfo,
  addDataNationality,
  addBirth,
  addInstagram,
  addOppositionfor,
  addStudyFor,
  giveCroquetas,
} from "../data/controllerProperties/controllerPersonalData";

// Importaciones de utilidad con el localStorage
import jsonData from "../data/localStorageData.json";

import {
  loadLocalStorageFromFile,
  saveLocalStorageFile,
} from "../data/LocalStorage/controllerLocalStorage";

export const monitorMessage = (
  channel,
  tags,
  message,
  self,
  prevUser,
  timeoutRef,
  setIsInfoUserVisible,
  setCurrentUser
) => {
  if (self || !message.startsWith("!")) return;
  const username = tags.username;

  // Validar comando
  const commandVerify = validateCommand(message.toLowerCase().split(" ")[0]);
  if (!commandVerify) return;
 

  // promps que extraemos del comando
  const command = message.toLowerCase().split(" ")[0].slice(1);

  const args = message.slice(1).split(" ");
  const arg = args[1];
  const otherUsername = message.slice(7);
  const taskLowercase = message.substring(command.length + 1);
  const task = taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(1);
  const taskMod =
    taskLowercase.charAt(0).toUpperCase() + taskLowercase.slice(4);

  const isSub = tags.badges?.subscriber;
  const isVip = tags.badges?.vip;
  const isMod = tags.badges?.moderator;
  const isPrime = tags.badges?.premium;

  const isTag = isSub
    ? "sub"
    : isVip
    ? "vip"
    : isMod
    ? "mod"
    : isPrime
    ? "prime"
    : "none";

    foundOrCreateUser(username, isTag);
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
        const argsSplit = taskLowercase.split("-");
        console.log(argsSplit);
        if (argsSplit.length !== 2) {
          console.log(
            "Formato incorrecto. Usa: !cambiarusuario viejoUsuario - nuevoUsuario"
          );
          break;
        }

        const oldUser = argsSplit[0].trim();
        const newUser = argsSplit[1].trim();

        if (!oldUser || !newUser) {
          console.log("Ambos nombres de usuario deben estar presentes.");
          break;
        }

        changeNameUser(channel, oldUser, newUser);
      }
      break;

    // Administrar tareas
    case "tarea":
    case "add":
    case "task":
    case "t":
      addTaskUser(username, task, channel, isTag);
      break;
    case "lista":
    case "list":
      reviewListTaskUser(username, channel, isTag);
      break;
    case "v":
    case "marcar":
    case "check":
      readyTaskUser(username, arg, channel, isTag);
      break;
    case "x":
    case "eliminar":
    case "borrar":
    case "delete":
      deleteTaskUser(username, arg, channel, isTag);
      break;
    case "modificar":
    case "cambiar":
    case "change":
      modifyTaskUser(username, arg, taskMod, channel, isTag);
      break;
    case "clear":
    case "borrartodo":
      deleteAllListTaskUser(username, channel, isTag);
      break;
    case "pickup":
    case "realizadas":
      readyListAllListUser(username, channel, isTag);
      break;

    //Administrar información personal de usuarios
    case "nacimiento":
      addBirth(username, arg, channel, isTag);
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
      addExam(username, task, channel, isTag);
      break;
    case "examdelete":
      deleteExam(username, arg, channel, isTag);
      break;
    case "reviewexam":
      reviewExam(username, channel, isTag);
      break;
    case "deleteallexam":
      deleteAllExams(username, channel, isTag);
      break;

    /* Administrar lista de examenes
    case "guardar":
      saveLocalStorageFile();
      break;
    case "cargar":
      loadLocalStorageFromFile(jsonData);
      break;

    default:
      break; */
  }

  // Lógica de temporizador
  handleTimer(
    username,
    prevUser,
    timeoutRef,
    setIsInfoUserVisible,
    setCurrentUser
  );

  setCurrentUser(username);
  setIsInfoUserVisible(true);
  deleteInactiveUsersTwoMonths();
};
