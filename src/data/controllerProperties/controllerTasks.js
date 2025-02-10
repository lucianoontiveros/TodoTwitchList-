import {
  users,
  registrationUsers,
} from "../LocalStorage/controllerLocalStorage";
import { foundOrCreateUser } from "../controllerUsers/controllerUsers";
import { addDataPoints } from "./controllerPersonalData";
import client from "../controllerClientTwitch/clientTwitch";
import { bonusPoint } from "./controllerPersonalData";
class Task {
  constructor(task, ID) {
    this.description = task;
    this._id = ID;
    this.active = false;
  }
}

// Gestor de mensajes
const sendMessage = (message, channel) => {
  client.say(channel, message);
};

const MESSAGES = {
  addTask: (user, task, ID) =>
    ` @${user}, 📄 Registramos tu tarea: ${task} | 📎ID: ${ID}.`,
  noTasks: (user) =>
    `| @${user}, no tienes tareas registradas. Puedes informarte como utilizar el gestor de tareas a través de !taskInfo.`,
  tasksList: (user, description, ID) =>
    `| @${user}| 📋 ${description}  | !marcar ${ID} ✅ | !eliminar ${ID} ❌  |`,
  deleteTask: (user, description, ID) =>
    `| @${user} | La tarea 📎 ID: ${ID} | 📋 ${description} | fue ELIMINADA ❌.`,
  readyTask: (user, description, ID) =>
    `| @${user} | La tarea 📎 ID: ${ID} | 📋 ${description} | fue marcada como REALIZADA ✅.`,
  readyAllTaks: (user) =>
    `| @${user} todas tus tareas fueron marcadas como REALIZADAS ✅.`,
  clearAllTaks: (user) => `${user} todas tus tareas fueron ELIMINADAS ❌.`,
  noFoundTask: (user, ID) =>
    `| @${user}| La tarea 📎 ID: ${ID} | no existe ⭕.`,
  modifyTask: (user, ID, task) =>
    `| @${user}| la tarea con 📎 ID: ${ID}| fue modificada por 📋 "${task}"`,
  exceededTask: (user, MAX_TASKS) =>
    `¡ @${user} ! superaste el limite de ${MAX_TASKS} preestablecidos. No podras agregar otras hasta terminar alguno de tus pendientes ❌📋`,
  limiteTask: (user, availableTasks, MAX_TASKS) =>
    `¡ @${user} ! Solo pudiste agregar ${availableTasks} de las taras que querias registrar, por que superaste el limite de ${MAX_TASKS} preestablecidos ❌📋.`,
};

// Funciones para dar soporte a funciones principales

const examID = () => Math.random().toString(36).substring(2, 5);

const reviewListTask = (user, channel) => {
  let task = users[user].tasks;
  if (task.length === 0) {
    sendMessage(MESSAGES.noTasks(user), channel);
  } else {
    task.forEach((usertTask) =>
      sendMessage(
        MESSAGES.tasksList(user, usertTask.description, usertTask._id),
        channel
      )
    );
    addDataPoints(user);
  }
};

const filterTaskListUser = (user, ID) => {
  return users[user].tasks.filter((userTask) => userTask._id != ID);
};

const foundTask = (user, ID) => {
  return users[user].tasks.find((userTask) => userTask._id === ID);
};

const foundIndexTask = (user, ID) => {
  return users[user].tasks.findIndex((userTask) => userTask._id === ID);
};

// Funciones para gestionar tareas.

const addTaskUser = (user, addTask, channel) => {
  const MAX_TASKS = 10;

  // Separar tareas si hay un punto y coma
  const tasks = addTask.includes(";") ? addTask.split(";") : [addTask];

  const currentTasksCount = users[user]?.tasks.length || 0;
  const trimmedTasks = tasks
    .map((task) => task.trim())
    .filter((task) => task.length > 0);

  console.log(tasks);

  const availableSlots = MAX_TASKS - currentTasksCount;

  if (currentTasksCount >= MAX_TASKS) {
    sendMessage(MESSAGES.exceededTask(user, MAX_TASKS), channel);
    return;
  }

  if (trimmedTasks.length > availableSlots) {
    sendMessage(MESSAGES.limiteTask(user, availableSlots, MAX_TASKS), channel);
  }

  foundOrCreateUser(user);

  const tasksToAdd = trimmedTasks.slice(0, availableSlots);
  tasksToAdd.forEach((task) => {
    const newTaskUser = new Task(task, examID());
    users[user].tasks.push(newTaskUser);
    sendMessage(
      MESSAGES.addTask(user, newTaskUser.description, newTaskUser._id),
      channel
    );
  });

  registrationUsers(users);
  addDataPoints(user);
};

const reviewListTaskUser = (user, channel) => {
  foundOrCreateUser(user);
  reviewListTask(user, channel);
};

const readyTaskUser = (user, ID, channel) => {
  const taskUser = foundTask(user, ID);
  console.log(taskUser);
  if (!taskUser) {
    sendMessage(MESSAGES.noFoundTask(user, ID), channel);
  } else {
    sendMessage(
      MESSAGES.readyTask(user, taskUser.description, taskUser._id),
      channel
    );
    users[user].tasks = filterTaskListUser(user, ID);
    addDataPoints(user);
    registrationUsers(users);
  }
};

const deleteTaskUser = (user, ID, channel) => {
  const taskUser = foundTask(user, ID);

  if (!taskUser) {
    sendMessage(MESSAGES.noFoundTask(user, ID), channel);
  } else {
    sendMessage(
      MESSAGES.deleteTask(user, taskUser.description, taskUser._id),
      channel
    );
    users[user].tasks = filterTaskListUser(user, ID);
    addDataPoints(user);
    registrationUsers(users);
  }
};

const modifyTaskUser = (user, ID, modifyTask, channel) => {
  const taskUser = foundIndexTask(user, ID);
  const taskFoundUser = foundTask(user, ID);

  if (!taskFoundUser) {
    sendMessage(MESSAGES.noFoundTask(user, ID), channel);
  } else {
    sendMessage(MESSAGES.modifyTask(user, ID, modifyTask), channel);
    users[user].tasks[taskUser].description = modifyTask;
  }
  foundOrCreateUser(user);
  registrationUsers(users);
};

const deleteAllListTaskUser = (user, channel) => {
  foundOrCreateUser(user);
  sendMessage(MESSAGES.clearAllTaks(user), channel);
  users[user].tasks = [];
  registrationUsers(users);
};

const readyListAllListUser = (user, channel) => {
  foundOrCreateUser(user);
  sendMessage(MESSAGES.readyAllTaks(user), channel);
  const points = users[user].tasks.length;
  users[user].tasks = [];
  if (points > 0) {
    addDataPoints(user);
    bonusPoint(user, points, channel);
  }
  registrationUsers(users);
};

export {
  addTaskUser,
  reviewListTaskUser,
  readyTaskUser,
  deleteTaskUser,
  modifyTaskUser,
  deleteAllListTaskUser,
  readyListAllListUser,
};
