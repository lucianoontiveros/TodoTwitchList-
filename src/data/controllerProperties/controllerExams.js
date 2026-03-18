import {
  users,
  registrationUsers,
} from "../LocalStorage/controllerLocalStorage";
import { foundOrCreateUser } from "../controllerUsers/controllerUsers";
import client from "../controllerClientTwitch/clientTwitch";

class Exams {
  constructor(dateExam, typeExam, titleExam, examID) {
    this.dateExam = dateExam;
    this.typeExam = typeExam;
    this.titleExam = titleExam;
    this._id = examID;
  }

  get id() {
    return `${this.titleExam} tiene el ID: ${this._id}`;
  }
}

const sendMensaje = (message, channel) => {
  client.say(channel, message);
};

const MESSAGE = {
  confirmAddExam: (user, dateExam, typeExam, titleExam) =>
    `Examen añadido por ${user}: 📅 Fecha: ${dateExam} 📄 Tipo: ${typeExam}  📑 Descripción: ${titleExam} `,
  errorValidDate: (user) =>
    `${user} Fecha no válida 😐. Use el formato dd-mm y asegúrese de que sea una fecha existente 📅. Además, debes hacer un espacio e ingresar las tres siglas de tipo de examen FIN REC PAR (final, recuparatorio, parcial) y finalmente describir la materia o tema evaluar. Ejemplo: para un recuperatorio el dia 10 del mes de septiembre !addexam 10-09 REC Matematica II.`,
  errorID: (user) => `🔦 El id especificado es incorrecto, ${user} `,
  noExamsID: (user) => `${user} 😐 No tienes un exam con ese ID.`,
  noExams: (user) =>
    `No tienes examenes pendientes ${user} 😁. Puede crear un listado utilizando  !addexam con el formato dd-mm, tipo de exam (tres letras) y el titulo del examen: ejemplo: Para un FINAL  el dia 12-03 de neumonia ingresar !addexam 12-03 FIN neumonia y otras enfermedades pulmonares 📑`,
  deleteExams: (user) =>
    `${user}, tus examenes fueron eliminados de la lista 🗑️`,
  deleteExam: (user, ID) => `${user} tu examen fue eliminado con ID: ${ID} 🗑️`,
  viewExam: (user, dateExam, typeExam, titleExam, ID) =>
    `${user} 📅 Fecha: ${dateExam} 📄 Tipo: ${typeExam} 📑 ${titleExam} ID: ${ID}`,
};

// comprobaciones de ingreso de fecha
const isValidDate = (dateString) => {
  const [day, month] = dateString.split("-").map(Number);

  // Validar rango de mes
  if (month < 1 || month > 12) return false;

  // Validar rango de día según el mes
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Ajustar para años bisiestos (asumiendo año actual)
  const currentYear = new Date().getFullYear();
  if (
    month === 2 &&
    currentYear % 4 === 0 &&
    (currentYear % 100 !== 0 || currentYear % 400 === 0)
  ) {
    daysInMonth[1] = 29;
  }

  return day > 0 && day <= daysInMonth[month - 1];
};

//Verificar si la fecha del examen es pasada
const isPastDate = (dateString) => {
  const [day, month] = dateString.split("-").map(Number);
  const today = new Date();
  // Ignorar horas, comparando solo fechas
  const examDate = new Date(today.getFullYear(), month - 1, day, 0, 0, 0, 0);
  const todayWithoutTime = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
    0,
    0,
    0,
    0
  );

  return examDate < todayWithoutTime;
};

const examID = () => Math.random().toString(36).substring(2, 5);

const addExam = (addExamUser, dateExamUser, channel, isTag) => {
  foundOrCreateUser(addExamUser, isTag);
  const dateExam = dateExamUser.slice(0, 6);
  if (dateExam.length === 0) {
  }

  // Validar formato de fecha
  if (!isValidDate(dateExam)) {
    sendMensaje(MESSAGE.errorValidDate(addExamUser), channel);
    return;
  }

  const typeExam = dateExamUser.slice(6, 10).toUpperCase();
  const titleExam =
    dateExamUser.slice(10).charAt(0).toUpperCase() + dateExamUser.slice(11);

  const newDataExamUser = new Exams(dateExam, typeExam, titleExam, examID());
  users[addExamUser].exams.push(newDataExamUser);

  // Ordenar exámenes por fecha (día y mes)
  users[addExamUser].exams.sort((a, b) => {
    const [dayA, monthA] = a.dateExam.split("-").map(Number);
    const [dayB, monthB] = b.dateExam.split("-").map(Number);

    if (monthA === monthB) {
      return dayA - dayB; // Ordenar por día si el mes es el mismo
    }
    return monthA - monthB; // Ordenar por mes
  });

  // Filtrar solo exámenes que no sean pasados
  users[addExamUser].exams = users[addExamUser].exams.filter(
    (exam) => !isPastDate(exam.dateExam)
  );
  sendMensaje(
    MESSAGE.confirmAddExam(addExamUser, dateExam, typeExam, titleExam),
    channel
  );
  registrationUsers(users);
};

// Eliminar examen por ID
const deleteExam = (deleteExamUser, examID, channel, isTag) => {
  foundOrCreateUser(deleteExamUser, isTag);
  const deleteExamForID = users[deleteExamUser].exams.findIndex(
    (examUser) => examUser._id === examID
  );
  if (deleteExamForID != -1) {
    users[deleteExamUser].exams.splice(deleteExamForID, 1);
    sendMensaje(MESSAGE.deleteExam(deleteExamUser, examID), channel);
  } else {
    sendMensaje(MESSAGE.noExamsID(deleteExamUser), channel);
  }
  registrationUsers(users);
};

const reviewExam = (reviewExamUSer, channel, isTag) => {
  foundOrCreateUser(reviewExamUSer, isTag);
  users[reviewExamUSer].exams = users[reviewExamUSer].exams.filter(
    (exam) => !isPastDate(exam.dateExam)
  );

  // Filtrar los exámenes vencidos y no vencidos
  const expiredExams = users[reviewExamUSer].exams.filter((exam) =>
    isPastDate(exam.dateExam)
  );
  const validExams = users[reviewExamUSer].exams.filter(
    (exam) => !isPastDate(exam.dateExam)
  );

  // Si hay exámenes vencidos, enviamos un mensaje por cada uno antes de eliminarlos
  if (expiredExams.length > 0) {
    expiredExams.forEach((exam) => {
      let message = `${reviewExamUSer}, tu examen ${exam.titleExam} expiró, del día (${exam.dateExam}) fue eliminado 🗑️`;
      sendMensaje(message, "cuartodechenz");
    });

    // Eliminar los exámenes vencidos
    users[reviewExamUSer].exams = validExams;
  }

  // Guardar los cambios
  registrationUsers(users);

  // Mostrar los exámenes restantes si hay
  if (validExams.length > 0) {
    validExams.forEach((userExam) => {
      sendMensaje(
        MESSAGE.viewExam(
          reviewExamUSer,
          userExam.dateExam,
          userExam.typeExam,
          userExam.titleExam,
          userExam._id
        ),
        channel
      );
    });
  } else {
    sendMensaje(MESSAGE.noExams(reviewExamUSer), channel);
  }
};

const deleteAllExams = (deletaAllExamUSer, channel, isTag) => {
  foundOrCreateUser(deletaAllExamUSer, isTag);
  const deleteListExamsUser = users[deletaAllExamUSer].exams.map(
    (userExam) => {}
  );
  if (deleteListExamsUser.length === 0) {
    sendMensaje(MESSAGE.noExams(deletaAllExamUSer), channel);
  } else {
    users[deletaAllExamUSer].exams = [];
    sendMensaje(MESSAGE.deleteExams(deletaAllExamUSer), channel);
  }
  registrationUsers(users);
};

// Comando summary: mostrar todos los exámenes de todos los usuarios en próximos 30 días
const summaryExams = (summaryUser, channel, isTag) => {
  const allExams = [];
  const today = new Date();
  const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
  
  // Recorrer todos los usuarios y sus exámenes
  Object.entries(users).forEach(([username, userData]) => {
    if (userData.exams && userData.exams.length > 0) {
      userData.exams.forEach(exam => {
        // Parsear fecha del examen
        const [day, month] = exam.dateExam.split("-").map(Number);
        const examDate = new Date(today.getFullYear(), month - 1, day);
        
        // Verificar si el examen está dentro de los próximos 30 días
        if (examDate >= today && examDate <= thirtyDaysFromNow) {
          allExams.push({
            username,
            dateExam: exam.dateExam,
            typeExam: exam.typeExam,
            titleExam: exam.titleExam,
            _id: exam._id,
            examDateObj: examDate
          });
        }
      });
    }
  });
  
  // Ordenar exámenes por fecha
  allExams.sort((a, b) => a.examDateObj - b.examDateObj);
  
  // Enviar resumen
  if (allExams.length === 0) {
    sendMensaje(`📅 No hay exámenes programados en los próximos 30 días 😊`, channel);
  } else {
    sendMensaje(`📋 **RESUMEN DE EXÁMENES - Próximos 30 días** 📋`, channel);
    sendMensaje(`📊 Total de exámenes: ${allExams.length}`, channel);
    sendMensaje(`─`.repeat(50), channel);
    
    allExams.forEach((exam, index) => {
      const daysUntil = Math.ceil((exam.examDateObj - today) / (1000 * 60 * 60 * 24));
      const urgencyEmoji = daysUntil <= 3 ? "🔴" : daysUntil <= 7 ? "🟡" : "🟢";
      
      sendMensaje(
        `${urgencyEmoji} ${index + 1}. 👤 ${exam.username} | 📅 ${exam.dateExam} (${daysUntil} días) | 📄 ${exam.typeExam} | 📑 ${exam.titleExam}`,
        channel
      );
    });
    
    sendMensaje(`─`.repeat(50), channel);
    sendMensaje(`🎯 ¡Mucha suerte en sus exámenes! 🎯`, channel);
  }
};

export { addExam, deleteExam, reviewExam, deleteAllExams, summaryExams };
