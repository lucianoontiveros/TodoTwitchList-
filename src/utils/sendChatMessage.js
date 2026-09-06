import client from "../data/controllerClientTwitch/clientTwitch";

// Envía un mensaje al chat de Twitch del canal indicado.
// Reemplaza las 3 copias idénticas de "sendMensaje/sendMessage" que
// existían en controllerTasks.js, controllerExams.js y controllerPersonalData.js.
export const sendChatMessage = (message, channel) => {
  client.say(channel, message);
};
