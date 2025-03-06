import { Viewer } from "../constructores";
import client from "../controllerClientTwitch/clientTwitch";

import {
  users,
  registrationUsers,
} from "../LocalStorage/controllerLocalStorage";

const sendMessage = (channel, message, error) => {
  if (error) {
    client.say(channel, "Deberías verificar el comando ingresado");
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
    `El usuario ${oldUserView} cambio su nombre a ${newUserView}.`,
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
    console.log("No encontré el usuario");
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
      identifiedUser(foundUserView, tag);
    } else {
      const user = new Viewer(foundUserView);
      user.mensaje = MESSAGES.userGenerated(user.name);
      user.tag = tag;
      user.registerUser();
      user.registerID();
      users[foundUserView] = user;
      registrationUsers(users);
    }
  } catch (error) {
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
    sendMessage(channel, MESSAGES.userDeleteError(), error);
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

// Borrar usuarios inactivos por más de dos meses
const deleteInactiveUsersTwoMonths = () => {
  const currentTime = new Date().getTime();
  const twoMonths = 60 * 60 * 24 * 30 * 2 * 1000;
  let usersDeleted = false;

  Object.keys(users).forEach((username) => {
    const user = users[username];
    if (user.lastTime) {
      const lastActiveTime = new Date(user.lastTime).getTime();
      if (currentTime - lastActiveTime > twoMonths) {
        delete users[username];
        sendMessage(MESSAGES.userInactiveDeleted(username));
        usersDeleted = true;
      }
    }
  });

  registrationUsers(users);

  if (!usersDeleted) {
    console.log(MESSAGES.noInactiveUsers()); // Registrar en consola
  }
};

export {
  foundOrCreateUser,
  deleteUser,
  verifyIdUser,
  changeNameUser,
  deleteInactiveUsersTwoMonths,
};
