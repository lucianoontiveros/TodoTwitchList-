import { Viewer } from "../constructores";
import client from "../controllerClientTwitch/clientTwitch";

import {
  users,
  registrationUsers,
} from "../LocalStorage/controllerLocalStorage";

const sendMessage = (channel, message, error) => {
  if (error) {
    client.say(channel, "Deberias verificar el comando ingresado");
    return console.error(message);
  }
  client.say(channel, message);
};

const MESSAGES = {
  userAssignedPropsError: () =>
    "Inconvenientes para asignarles propiedades al usuario desde el localStorage.",
  userNotFound: (username) => `El usuario ${username} no existe.`,
  userGenerated: (username) => `El usuario ${username} fue generado.`,
  userNameChange: (oldUserView, newUserView) =>
    `El usuario ${oldUserView} cambio su nombrea a ${newUserView}.`,
  userRegistered: (username) => `Usuario ${username} registrado exitosamente.`,
  userID: (username, id) => `ID del usuario ${username}: ${id}`,
  userDeleteSuccess: (username) =>
    `Se eliminó el usuario ${username} correctamente.`,
  userDeleteMismatch: (username, id) =>
    `El usuario ${username} no se corresponde con el ID ${id}.`,
  userDeleteError: () =>
    "Inconvenientes para eliminar el usuario. Favor de verificar userViewID.",
  userNameChangeError: () =>
    "No se puede asignar el nuevo nombre y mantener los atributos.",
  userInactiveDeleted: (username) =>
    `Usuario ${username} eliminado por inactividad de más de dos meses.`,
  noInactiveUsers: () =>
    "No se encontró ningún usuario inactivo por más de dos meses.",
  userIDVerifyError: () => "No se puede verificar cual es el ID del usuario.",
  userFoundOrCreateError: () =>
    "Inconvenientes para encontrar el usuario y/o registrarlo.",
};

// Buscar un usuario por nombre
const foundUser = (username) => {
  if (!users[username]) {
    console.log("no encontre el usuario");
    throw new Error(MESSAGES.userNotFound(username));
  }
  return users[username];
};

// Devolver un objeto con propiedades al extraer de localStorage
const identifiedUser = (foundUserView, tag) => {
  try {
    const userAdapter = new Viewer(users[foundUserView].name);
    Object.assign(userAdapter, users[foundUserView]);
    userAdapter.registerUser();
    users[foundUserView] = userAdapter;
    users[foundUserView].tag = tag;
    registrationUsers(users);
  } catch (error) {
    sendMessage(MESSAGES.userIDVerifyError(), error);
  }
};

// Identificación de usuario
const foundOrCreateUser = (foundUserView, tag) => {
  try {
    if (users[foundUserView]) {
      // Si el usuario existe, asegurarse de que tenga la estructura correcta
      const user = users[foundUserView];
      if (!user._id || !user.name || !user.tag) {
        console.log(`Reparando estructura del usuario: ${foundUserView}`);
        const newUser = new Viewer(foundUserView);
        // Preservar datos existentes
        Object.assign(newUser, user);
        // Asegurar propiedades requeridas
        if (!newUser._id) newUser.registerID();
        if (!newUser.tag) newUser.tag = tag;
        newUser.registerUser();
        users[foundUserView] = newUser;
        registrationUsers(users);
      } else {
        identifiedUser(foundUserView, tag);
      }
    } else {
      // Crear nuevo usuario
      const user = new Viewer(foundUserView);
      user.mensaje = MESSAGES.userGenerated(user.name);
      user.tag = tag;
      user.registerUser();
      user.registerID();
      users[foundUserView] = user;
      registrationUsers(users);
      console.log(`Nuevo usuario creado: ${foundUserView}`, user);
    }
  } catch (error) {
    console.error('Error en foundOrCreateUser:', error);
    sendMessage(MESSAGES.userIDVerifyError(), error);
  }
};

// Verificar ID de usuario
const verifyIdUser = (channel, userVerifyViewID) => {
  try {
    const user = foundUser(userVerifyViewID);
    sendMessage(channel, MESSAGES.userID(userVerifyViewID, user._id));
    console.log("Estoy en el TRY");
  } catch (error) {
    sendMessage(channel, MESSAGES.userIDVerifyError(), error);
    console.log("Estoy en el CATCH");
  }
};

// Borrar usuario con ID propio
const deleteUser = (channel, userViewDelete, userViewID) => {
  try {
    const user = foundUser(userViewDelete);
    if (user._id === userViewID) {
      delete users[userViewDelete];
      registrationUsers(users);
      sendMessage(channel, MESSAGES.userDeleteSuccess(userViewDelete));
    } else {
      sendMessage(
        channel,
        MESSAGES.userDeleteMismatch(userViewDelete, userViewID)
      );
    }
  } catch (error) {
    sendMessage(channel, MESSAGES.userDeleteError()), error;
  }
};

// Cambiar nombre sosteniendo los atributos del usuario original
const changeNameUser = (channel, oldUserView, newUserView) => {
  try {
    const oldUser = foundUser(oldUserView);
    const newUser = new Viewer(newUserView);
    oldUser.name = newUserView;
    newUser._id = oldUser._id; // Transferir ID al nuevo usuario
    Object.assign(newUser, oldUser);
    users[newUserView] = newUser;
    delete users[oldUserView];
    registrationUsers(users);
    sendMessage(channel, MESSAGES.userNameChange(oldUserView, newUserView));
  } catch (error) {
    sendMessage(channel, MESSAGES.userNameChangeError(), error);
  }
};

// Flag para evitar ejecuciones concurrentes
let isCleaningInactiveUsers = false;

// Método de prueba (dry-run) - solo muestra qué usuarios se eliminarían sin borrarlos
const testDeleteInactiveUsers = (channel) => {
  const currentTime = new Date().getTime();
  const ninetyDays = 60 * 60 * 24 * 90 * 1000;
  const thirtyDays = 60 * 60 * 24 * 30 * 1000;
  const inactiveUsers = [];
  const warningUsers = [];

  Object.keys(users).forEach((username) => {
    const user = users[username];
    if (user.lastTime) {
      const lastActiveTime = new Date(user.lastTime).getTime();
      const daysInactive = Math.floor((currentTime - lastActiveTime) / (1000 * 60 * 60 * 24));

      if (currentTime - lastActiveTime > ninetyDays) {
        inactiveUsers.push({
          username,
          lastTime: new Date(user.lastTime).toLocaleString('es-ES'),
          daysInactive
        });
      } else if (currentTime - lastActiveTime > thirtyDays) {
        warningUsers.push({
          username,
          lastTime: new Date(user.lastTime).toLocaleString('es-ES'),
          daysInactive
        });
      }
    }
  });

  // Mostrar usuarios próximos a borrarse (30+ días)
  if (warningUsers.length > 0) {
    client.say(channel, `⚠️ ${warningUsers.length} usuarios próximos a borrarse (30+ días inactivos):`);
    warningUsers.slice(0, 10).forEach((user) => {
      client.say(channel, `👤 ${user.username} - Última actividad: ${user.lastTime} (${user.daysInactive} días)`);
    });
    if (warningUsers.length > 10) {
      client.say(channel, `... y ${warningUsers.length - 10} más.`);
    }
  }

  // Mostrar usuarios que se borrarían (90+ días)
  if (inactiveUsers.length === 0) {
    client.say(channel, "✅ No hay usuarios inactivos por más de 90 días.");
  } else {
    client.say(channel, `🚨 ${inactiveUsers.length} usuarios inactivos por más de 90 días (DRY-RUN - NO se borrarán):`);
    inactiveUsers.slice(0, 10).forEach((user) => {
      client.say(channel, `👤 ${user.username} - Última actividad: ${user.lastTime} (${user.daysInactive} días)`);
    });
    if (inactiveUsers.length > 10) {
      client.say(channel, `... y ${inactiveUsers.length - 10} más. Total: ${inactiveUsers.length} usuarios.`);
    }
  }

  if (warningUsers.length === 0 && inactiveUsers.length === 0) {
    client.say(channel, "✅ No hay usuarios inactivos ni próximos a borrarse.");
  }

  return { inactiveUsers, warningUsers };
};

// Borrar usuarios inactivos por más de 90 días
const deleteInactiveUsersTwoMonths = () => {
  // Evitar ejecuciones concurrentes
  if (isCleaningInactiveUsers) {
    return;
  }

  isCleaningInactiveUsers = true;

  const currentTime = new Date().getTime();
  const ninetyDays = 60 * 60 * 24 * 90 * 1000;
  let usersDeleted = false;

  Object.keys(users).forEach((username) => {
    const user = users[username];
    if (user.lastTime) {
      const lastActiveTime = new Date(user.lastTime).getTime();
      if (currentTime - lastActiveTime > ninetyDays) {
        delete users[username];
        sendMessage("cuartodechenz", MESSAGES.userInactiveDeleted(username));
        usersDeleted = true;
      }
    }
  });

  registrationUsers(users);

  // Resetear el flag después de un breve delay
  setTimeout(() => {
    isCleaningInactiveUsers = false;
  }, 1000);
};

export {
  foundOrCreateUser,
  deleteUser,
  verifyIdUser,
  changeNameUser,
  deleteInactiveUsersTwoMonths,
  testDeleteInactiveUsers,
};
