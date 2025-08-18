import {
  users,
  registrationUsers,
} from "../LocalStorage/controllerLocalStorage";
import { foundOrCreateUser } from "../controllerUsers/controllerUsers";
import client from "../controllerClientTwitch/clientTwitch";
class PersonalData {
  constructor() {
    this.sign;
    this.points = 0;
    this.nationality;
    this.birth;
    this.instagram;
    this.oppositionfor;
    this.studyfor;
    this.croquetastotal;
  }
}

const sendMensaje = (message, channel) => {
  client.say(channel, message);
};

const MESSAGE = {
  addConfirmDataUser: (user) =>
    `${user} agrega por primera vez un perfil de información de usuario 🏛️`,
  addPointsUser: (user, points) =>
    points == 1
      ? `${user} agregó ${points} punto ➕`
      : `${user} ahora tiene ${points} puntos ➕`,
  addNationalityUser: (user, nationality) =>
    `${user}, confirma su nacionalidad como ${nationality} 🏴`,
  addBirthUser: (user, birth, sign) =>
    `${user} indico que su fecha de nacimiento es el  📅 ${birth} y su signo es ${sign}`,
  addInstagramUser: (user, instagram) =>
    `${user} confirma que su usuario de instagram es: ${instagram} 📷`,
  addOppositionUser: (user, oppositionUser) =>
    `${user} indicó que oposita para ${oppositionUser} 🛡️`,
  addStudyForUser: (user, studyForUser) =>
    `${user} indicó que estudia para ${studyForUser} 🎓`,
  addCroquetasUser: (user, croquetasUser) =>
    croquetasUser == 1
      ? `${user} le entregó ${croquetasUser} croqueta a Brunito, en todo este tiempo 🍪`
      : `${user} le entrego ${croquetasUser} croquetas en todo este tiempo 🍪`,
  noPoints: (user) =>
    `${user}, 😐 no tiene puntos. Puede generar los mismos registrando y gestionando tus tareas y examenes`,
};

const reviewPersonalData = (user) => {
  if (!users[user]?.personaldata?.length) {
    const personalDataUser = new PersonalData();
    users[user] = { ...users[user], personaldata: [personalDataUser] }; // Evitar mutaciones directas
    sendMensaje(MESSAGE.addConfirmDataUser(user));
    registrationUsers(users);
  }
};

const updatePersonalData = (user, key, value) => {
  reviewPersonalData(user);
  users[user].personaldata.forEach((data) => (data[key] = value));
  registrationUsers(users);
};

const getUserInfo = (user, channel) => {
  // Asegurarse de que el usuario existe y tiene datos personales
  if (!users[user] || !users[user].personaldata?.length) {
    return sendMensaje(
      `${user} aún no tiene información registrada. Por favor, agrega datos con los comandos disponibles.`,
      channel
    );
  }

  // Extraer los datos del usuario
  const personalData = users[user].personaldata[0];

  // Formatear la información del usuario
  const userInfo = `
  Información del usuario: ${user}
  ${personalData.sign ? `- Signo zodiacal: ${personalData.sign}` : ""}
  ${personalData.points ? `- Puntos: ${personalData.points}` : ""}
  ${
    personalData.nationality
      ? `- Nacionalidad: ${personalData.nationality}`
      : ""
  }
  ${personalData.birth ? `- Fecha de nacimiento: ${personalData.birth}` : ""}
 
  ${personalData.instagram ? `- Instagram: ${personalData.instagram}` : ""}
  ${
    personalData.oppositionfor
      ? `- Oposición: ${personalData.oppositionfor}`
      : ""
  }
  ${personalData.studyfor ? `- Estudios: ${personalData.studyfor}` : ""}
  ${
    personalData.croquetastotal
      ? `- Croquetas totales entregadas: ${personalData.croquetastotal}`
      : ""
  }
  `;

  // Enviar el mensaje al canal
  sendMensaje(userInfo, channel);
};

const addBirth = (user, dateBirth, channel, isTag) => {
  foundOrCreateUser(user, isTag);
  reviewPersonalData(user);
  updatePersonalData(user, "birth", dateBirth);
  registrationUsers(users);
  addDataSignZodiacal(user, dateBirth, channel);
};

const addDataSignZodiacal = (user, dateBirth, channel) => {
  const [dia, mes] = dateBirth.split("-").map(Number);

  // Validación de fecha
  if (
    Number.isNaN(dia) || // No es un número
    Number.isNaN(mes) || // No es un número
    dia <= 0 || // Día no válido
    dia > 31 || // Día fuera de rango
    mes <= 0 || // Mes no válido
    mes > 12 // Mes fuera de rango
  ) {
    return sendMensaje("La fecha ingresada no es válida", channel);
  }

  // Determinación del signo zodiacal
  let sign;
  switch (mes) {
    case 3:
      sign = dia >= 21 ? "Aries ♈" : "Piscis ♓";
      break;
    case 4:
      sign = dia <= 19 ? "Aries ♈" : "Tauro ♉";
      break;
    case 5:
      sign = dia <= 20 ? "Tauro ♉" : "Géminis ♊";
      break;
    case 6:
      sign = dia <= 20 ? "Géminis ♊" : "Cáncer ♋";
      break;
    case 7:
      sign = dia <= 22 ? "Cáncer ♋" : "Leo ♌";
      break;
    case 8:
      sign = dia <= 22 ? "Leo ♌" : "Virgo ♍";
      break;
    case 9:
      sign = dia <= 22 ? "Virgo ♍" : "Libra ♎";
      break;
    case 10:
      sign = dia <= 22 ? "Libra ♎" : "Escorpio ♏";
      break;
    case 11:
      sign = dia <= 21 ? "Escorpio ♏" : "Sagitario ♐";
      break;
    case 12:
      sign = dia <= 21 ? "Sagitario ♐" : "Capricornio ♑";
      break;
    case 1:
      sign = dia <= 18 ? "Capricornio ♑" : "Acuario ♒";
      break;
    case 2:
      sign = dia <= 19 ? "Acuario ♒" : "Piscis ♓";
      break;
    default:
      sign = "Indefinido, no pudo establecerse";
  }

  // Asignar el signo al usuario
  users[user].personaldata[0].sign = sign;

  // Enviar mensaje
  sendMensaje(MESSAGE.addBirthUser(user, dateBirth, sign), channel);
};

const addDataPoints = (user, channel) => {
  updatePersonalData(user);
  updatePersonalData(user, "points", users[user].personaldata[0].points + 1);
  sendMensaje(
    MESSAGE.addPointsUser(user, users[user].personaldata[0].points),
    channel
  );
};

const bonusPoint = (user, points, channel) => {
  updatePersonalData(
    user,
    "points",
    users[user].personaldata[0].points + points
  );
  sendMensaje(
    MESSAGE.addPointsUser(user, users[user].personaldata[0].points),
    channel
  );
};

const addDataNationality = (user, nationalityUser, channel) => {
  updatePersonalData(user, "nationality", nationalityUser);
  sendMensaje(MESSAGE.addNationalityUser(user, nationalityUser), channel);
};

const addInstagram = (user, instaUser, channel) => {
  updatePersonalData(user, "instagram", instaUser);
  sendMensaje(MESSAGE.addInstagramUser(user, instaUser), channel);
};

const addOppositionfor = (user, oppositionUser, channel) => {
  updatePersonalData(user, "oppositionfor", oppositionUser);
  sendMensaje(MESSAGE.addOppositionUser(user, oppositionUser), channel);
};

const addStudyFor = (user, studyforUser, channel) => {
  updatePersonalData(user, "studyfor", studyforUser);
  sendMensaje(MESSAGE.addStudyForUser(user, studyforUser), channel);
};

const addCroquetasTotal = (user, croquetas, channel) => {
  updatePersonalData(user, "croquetastotal", croquetas);
  sendMensaje(MESSAGE.addCroquetasUser(user, croquetas), channel);
};

const giveCroquetas = (user, channel) => {
  reviewPersonalData(user);
  if (users[user].personaldata[0].points !== 0) {
    let croquetas = users[user].personaldata[0].croquetastotal + 1 || 1;
    addCroquetasTotal(user, croquetas, channel);
    updatePersonalData(user, "points", users[user].personaldata[0].points - 1);
  } else sendMensaje(MESSAGE.noPoints(user), channel);
};

export {
  getUserInfo,
  addDataPoints,
  addDataNationality,
  addBirth,
  addInstagram,
  addOppositionfor,
  addStudyFor,
  addCroquetasTotal,
  giveCroquetas,
  bonusPoint,
};
