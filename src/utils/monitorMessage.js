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
  completeFirstTask,
} from "../data/controllerProperties/controllerTasks";

import {
  addExam,
  deleteExam,
  reviewExam,
  deleteAllExams,
  summaryExams,
  modifyExamDate,
  modifyExamDescription,
} from "../data/controllerProperties/controllerExams";

import {
  getUserInfo,
  addDataNationality,
  addBirth,
  addInstagram,
  addOppositionfor,
  addStudyFor,
  giveCroquetas,
  grantCroquetas,
} from "../data/controllerProperties/controllerPersonalData";

import { repairBrokenUsers } from "./repairUsers";
import client from "../data/controllerClientTwitch/clientTwitch";

export const monitorMessage = async (
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


    // Parsear los badges, manejando tanto string como objeto
    const badges = {};
    if (tags.badges) {
      if (typeof tags.badges === 'string') {
        // Formato antiguo: "moderator/1,subscriber/12"
        tags.badges.split(',').forEach(badge => {
          const [name, version] = badge.split('/');
          if (name && version) {
            badges[name.toLowerCase()] = version;
          }
        });
      } else if (typeof tags.badges === 'object') {
        // Formato nuevo: { moderator: '1', subscriber: '12' }
        Object.entries(tags.badges).forEach(([name, version]) => {
          if (name && version) {
            badges[name.toLowerCase()] = version;
          }
        });
      }
    }

    const isPrime = badges.premium !== undefined;
    const isVip = badges.vip !== undefined;
    const isMod = badges.moderator !== undefined;
    const isBroadcaster = badges.broadcaster !== undefined;
    const isSub = badges.subscriber !== undefined || isBroadcaster;

    let isTag = isSub ? "sub" 
    : isMod ? "mod" 
  : isVip ? "vip" 
  : isPrime ? "prime" 
  : "none";

console.log(isTag);

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
      // Soporte multi-ID con espacios opcionales: "!marcar 12; 34; 56;"
      {
        const idsText = taskLowercase.trim();
        const ids = idsText
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        if (ids.length > 1) {
          ids.forEach((id) => {
            readyTaskUser(username, id, channel, isTag);
          });
        } else {
          const singleId = ids[0] ?? arg; // fallback al primer argumento
          readyTaskUser(username, singleId, channel, isTag);
        }
      }
      break;
    case "done":
      completeFirstTask(username, channel);
      break;
    case "x":
    case "eliminar":
    case "borrar":
    case "delete":
      // Soporte multi-ID con espacios opcionales: "!eliminar 12; 34; 56;"
      {
        const idsText = taskLowercase.trim();
        const ids = idsText
          .split(";")
          .map((s) => s.trim())
          .filter((s) => s.length > 0);

        if (ids.length > 1) {
          ids.forEach((id) => {
            deleteTaskUser(username, id, channel, isTag);
          });
        } else {
          const singleId = ids[0] ?? arg; // fallback al primer argumento
          deleteTaskUser(username, singleId, channel, isTag);
        }
      }
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

    // Otorgar 50 croquetas a un usuario (solo streamer)
    case "croquetas50":
    case "dar50": {
      if (username !== "cuartodechenz") {
        await client.say(channel, "❌ Solo el streamer puede usar este comando.");
        break;
      }
      const targetRaw = (arg || taskLowercase).trim();
      const target = targetRaw.replace(/^@/, "");
      if (!target) {
        await client.say(channel, "Uso: !croquetas50 <usuario> | !dar50 <usuario>");
        break;
      }
      try {
        grantCroquetas(target, 50, channel);
        await client.say(channel, `🍪 Se otorgaron 50 croquetas a @${target}.`);
      } catch (error) {
        console.error('Error otorgando croquetas:', error);
        await client.say(channel, "No se pudo otorgar croquetas.");
      }
      break;
    }

    // Comando para reparar usuarios (solo para el streamer)
    case "reparar":
      console.log(`Comando reparar recibido de ${username}`);
      if (username === "cuartodechenz") {  // Asegurarse que solo el streamer puede usarlo
        try {
          console.log("Iniciando reparación de usuarios...");
          await client.say(channel, "🔧 Iniciando reparación de usuarios...");
          
          const result = await repairBrokenUsers();
          console.log("Resultado de la reparación:", result);
          
          if (result.repaired) {
            const message = `✅ Reparación completada. Se repararon ${result.count} usuarios.`;
            console.log(message);
            await client.say(channel, message);
            
            // Mostrar los usuarios reparados en grupos para no exceder el límite de caracteres
            const chunkSize = 5;
            for (let i = 0; i < result.users.length; i += chunkSize) {
              const chunk = result.users.slice(i, i + chunkSize);
              await client.say(channel, `📋 Reparados: ${chunk.join(', ')}`);
            }
          } else {
            const message = "ℹ️ No se encontraron usuarios que requieran reparación.";
            console.log(message);
            await client.say(channel, message);
          }
        } catch (error) {
          const errorMsg = `❌ Error al reparar usuarios: ${error.message}`;
          console.error(errorMsg, error);
          await client.say(channel, errorMsg);
        }
      } else {
        console.log(`Usuario no autorizado intentó usar !reparar: ${username}`);
        await client.say(channel, "❌ Solo el streamer puede usar este comando.");
      }
      break;

    // Administrar lista de examenes
    case "addexam":
    case "agregarexamen":
      addExam(username, task, channel, isTag);
      break;
    case "examdelete":
    case "eliminarexamen":
      deleteExam(username, arg, channel, isTag);
      break;
    case "reviewexam":
    case "revisarexamen":
      reviewExam(username, channel, isTag);
      break;
    case "deleteallexam":
    case "eliminartodosexamenes":
      deleteAllExams(username, channel, isTag);
      break;
    case "summary":
    case "resumenexamenes":
      summaryExams(username, channel);
      break;
    case "modifydateexam":
    case "modificarfechaexamen":
      // Formato: !modifydateexam ID nuevaFecha | !modificarfechaexamen ID nuevaFecha
      // Ejemplo: !modifydateexam x7z 15-09 | !modificarfechaexamen x7z 15-09
      let modifyArgs;
      if (command === "modificarfechaexamen") {
        // Para comandos en español, necesitamos extraer correctamente los argumentos
        const fullMessage = message.toLowerCase().split(" ");
        modifyArgs = fullMessage.slice(1); // Saltar el comando
      } else {
        modifyArgs = taskLowercase.trim().split(" ");
      }
      const examIdToModify = modifyArgs[0];
      const newExamDate = modifyArgs[1];
      if (examIdToModify && newExamDate) {
        modifyExamDate(username, examIdToModify, newExamDate, channel, isTag);
      } else {
        client.say(channel, "Uso: !modifydateexam ID nuevaFecha | !modificarfechaexamen ID nuevaFecha");
      }
      break;
    case "modifydescripexam":
    case "modificardescripexamen":
      // Formato: !modifydescripexam ID nuevaDescripcion | !modificardescripexamen ID nuevaDescripcion
      // Ejemplo: !modifydescripexam x7z "Cálculo Avanzado" | !modificardescripexamen x7z "Cálculo Avanzado"
      let descArgs;
      if (command === "modificardescripexamen") {
        // Para comandos en español, necesitamos extraer correctamente los argumentos
        const fullMessage = message.toLowerCase().split(" ");
        descArgs = fullMessage.slice(1); // Saltar el comando
      } else {
        descArgs = taskLowercase.trim().split(" ");
      }
      const examIdForDesc = descArgs[0];
      const newDescription = descArgs.slice(1).join(" ").replace(/^["']|["']$/g, '');
      if (examIdForDesc && newDescription) {
        modifyExamDescription(username, examIdForDesc, newDescription, channel, isTag);
      } else {
        client.say(channel, "Uso: !modifydescripexam ID 'nueva descripción' | !modificardescripexamen ID 'nueva descripción'");
      }
      break;

    default:
      break;
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