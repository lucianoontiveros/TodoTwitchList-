import React from 'react';
import { customAlphabet } from 'nanoid';
import { perfil } from '../App.jsx';

const nanoid = customAlphabet('1234567890abcdef', 10);

// Creamos un objeto para guardar temporalmente el rendimiento de usuario medio en tareas y croquetas con las que interactua con el bot. 
class Croquetas {
  constructor(username) {
    this.username = username;
    this.croquetasTotal= 0;
    this.croquetasCantidad = 0;
    this.tareasRealizadas = 0;
    this.tareasEliminadas = 0;
    this.mate = 0;
    this.te = 0;
    this.cafe = 0;
    this.comidas = 0;
    this.bano = 0;
  }
}

const croquetas = [];

const Controlador = (client, channel, command, username, tarea, id, badges) => {
  const usernameCroquetas = (username) => croquetas.find((item) => item.username === username);

  const identificarCroquetas = (username) => {
    if (!usernameCroquetas(username)) {
      let nuevoCroquetas = new Croquetas(username);
      croquetas.push(nuevoCroquetas);
    }
    croquetas.find((item) => {
      if (item.username === username) {
        item.croquetasCantidad = item.croquetasCantidad + 1
        const perfilUsuario = perfil.find((perfilItem) => perfilItem.username === username);
        if (perfilUsuario) {
          let croquetasHistoricas = perfilUsuario.croquetasTotal + 1;
          perfilUsuario.croquetasTotal = croquetasHistoricas
          console.log("me guarde")
        }
        let MensajecroquetaTotal = `Me regalaste un total de ${perfilUsuario.croquetasTotal} croquetas`
        let mensajeCroqueta = item.croquetasCantidad=== 1 ? `Me regalaste una croqueta ${username} BegWan VirtualHug hoy realizaste ${item.tareasRealizadas} de los pendientes GlitchCat ,` : `Me regalaste una croqueta ${username} BegWan VirtualHug hoy realizaste ${item.tareasRealizadas} tareas de tu lista GlitchCat,`
        let mensajeUsuario = item.croquetasCantidad=== 0 ? " No borraste niguna de las tareas registradas PogChamp " : ` y borraste ${item.tareasEliminadas} de las registradas PogChamp `
        let MensajeCam = ""
        if (username === 'camm_sss') {
          MensajeCam = 'Tu eres mi mamá Camm PrimeMe '
        }
        if (username === 'cristianmeichtry') {
          MensajeCam = 'Tu malditas croquetas están rancias BibleThump  '
        }
        client.say(channel, MensajeCam + mensajeCroqueta + mensajeUsuario + MensajecroquetaTotal)
        console.log(croquetas)
      }
    });
  };

  const rendicionCroqueta = (username, lengthTareas, negLengthTareas) => {
    if (!usernameCroquetas(username)) {
      let nuevoCroquetas = new Croquetas(username);
      croquetas.push(nuevoCroquetas);
    }
    croquetas.find((item) => {
      if (item.username === username) {
        if (lengthTareas) {
          item.croquetasCantidad += lengthTareas;
          item.tareasRealizadas += lengthTareas;
        }
        if (negLengthTareas) {
          item.tareasEliminadas += negLengthTareas;
        }
      }
    });
  };

  switch (command) {
    case '!task':
      perfil.find(item => {
        if (item.username === username) {
          if (item.tareas.length >= 10) {
            client.say(channel, `Disculpe, ${username}, la petición fue rechazada por un limite maximo de 10 tareas. Complete o elimine algunas de sus tareas. Sorry, ${username}, you've reached the maximum limit of tasks (10). Complete or delete existing tasks to add new ones.`);
            return;
          }
          item.tareas.push({ tarea, id: nanoid(3) })
          item.puntos += 50;
          client.say(channel, `/me imGlitch @${item.username} imGlitch I registered your task: 🐱‍💻 ${tarea}  | BegWan VirtualHug Could you give me a !croqueta?`);
        }
      })
      break;
    case '!tarea':
      perfil.find(item => {
        if (item.username === username) {
          if (item.tareas.length >= 10) {
            client.say(channel, `Disculpe, ${username}, la petición fue rechazada por un limite maximo de 10 tareas. Complete o elimine algunas de sus tareas. Sorry, ${username}, you've reached the maximum limit of tasks (10). Complete or delete existing tasks to add new ones.`);
            return;
          }
          let nuevoId = nanoid(3)
          item.tareas.push({ tarea, id: nuevoId })
          item.puntos += 50;
          client.say(channel, `/me imGlitch @${item.username} imGlitch registré tu tarea: 🐱‍💻 ${tarea} con 🔖 ${nuevoId} | BegWan VirtualHug podrías regalarme una !croqueta?`);
        }
      })
      break;
    case '!lista':
      perfil.find(item => {
        if (item.username === username) {
          const listaTareas = item.tareas.forEach(i => {
            client.say(channel, `/me imGlitch @${username} imGlitch TAREA: 📖  ${i.tarea} 🔖 !marcar ${i.id} 🔖 !eliminar ${i.id} BegWan`)
          })
          var anuncio = '/me No tiene tareas que tenga recordar. !comandos para revisar todo lo que puedo hacer BegWan VirtualHug .'
          if (item.tareas.length === 0) {
            return client.say(channel, anuncio)
          }
        }
      })
      break;
    case '!list':
      perfil.find(item => {
        if (item.username === username) {
          const listaTareas = item.tareas.forEach(i => {
            client.say(channel, `/me imGlitch @${username} imGlitch TAREA: 📖  ${i.tarea} 🔖 !marcar ${i.id} 🔖 !eliminar ${i.id} BegWan`)
          })
          var anuncio = `/me You don't have any tasks to remember. !commands to review everything I can do BegWan VirtualHug .`
          if (item.tareas.length === 0) {
            return client.say(channel, anuncio)
          }
        }
      })
      break;
    case '!delete':
      try {
        perfil.find(item => {
          if (item.username === username) {
            const tareaEliminada = item.tareas.find(u => u.id === id)
            client.say(channel, `This task was eliminated: 📖 ${tareaEliminada.tarea}  with the id: 🔖 ${tareaEliminada.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            item.tareas = tareasFiltradas
            rendicionCroqueta(username, 0, 1)
          }
        })
      } catch (error) {
        client.say(channel, `I have no idea what you are asking me to do. You should check the id, copy it when you throw the !list command CorgiDerp .`)
      }
      break;
    case '!eliminar':
      try {
        perfil.find(item => {
          if (item.username === username) {
            const tareaEliminada = item.tareas.find(u => u.id === id)
            console.log(tareaEliminada)
            client.say(channel, `Está tarea fue eliminada: 📖 ${tareaEliminada.tarea}  con el Id: 🔖 ${tareaEliminada.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            item.tareas = tareasFiltradas
            rendicionCroqueta(username, 0, 1)
          }
        })
      } catch (error) {
        client.say(channel, `no tengo idea que me estas pidiendo hacer. Deberias revisar el id, copiarlo al tirar el comando !lista CorgiDerp `)
      }
      break;
    case '!check':
      try {
        perfil.find(item => {
          if (item.username === username) {
            const taskCheck = item.tareas.find(u => u.id === id)
            client.say(channel, `This task was marked: 📖  ${taskCheck.tarea}  with the id:  🔖 ${taskCheck.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            console.log(tareasFiltradas)
            item.tareas = tareasFiltradas
            rendicionCroqueta(username, 1, 0)
          }
        })
      } catch (error) {
        client.say(channel, `I have no idea what you are asking me to do. You should check the id, copy it when you throw the !list command CorgiDerp .`)
      }
      break;
    case '!marcar':
      try {
        perfil.find(item => {
          if (item.username === username) {
            const taskCheck = item.tareas.find(u => u.id === id)
            client.say(channel, `Esta tarea fue marcada: 📖  ${taskCheck.tarea}  con el Id:  🔖 ${taskCheck.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            console.log(tareasFiltradas)
            item.tareas = tareasFiltradas
            rendicionCroqueta(username, 1, 0)
          }
        })
      } catch (error) {
        client.say(channel, `no tengo idea que me estas pidiendo hacer. Deberias revisar el id, copiarlo al tirar el comando !lista CorgiDerp `)
      }
      break;
    case '!clear':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron eliminadas ImTyping | All your tasks were deleted   ImTyping BegWan `)
          let negLengthTareas = item.tareas.length
          rendicionCroqueta(username, 0, negLengthTareas)
          item.tareas = []
        }
      })
      break;
    case '!pickup':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron marcadas como realizadas ImTyping | All your tasks were marked as done ImTyping BegWan `)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          let cantidadDeTareas = item.tareas.length
          let lengthTareas = item.tareas.length
          rendicionCroqueta(username, lengthTareas, 0)
          item.tareas = []
        }
      })
      break;
    case '!croqueta':
      identificarCroquetas(username)
      break;
    case '!eliminarusuario':
      if (username === 'cuartodechenz') {
        const indexToRemove = parseInt(id, 10); // asumimos que el id es el índice del usuario en el perfil
        if (!isNaN(indexToRemove) && indexToRemove >= 0 && indexToRemove < perfil.length) {
          // Eliminar el usuario del perfil
          const removedUser = perfil.splice(indexToRemove, 1)[0];
          client.say(channel, `Usuario ${removedUser.username} eliminado por cuartodechenz.`);
        } else {
          client.say(channel, 'Error: el índice proporcionado no es válido.');
        }
      } else {
        client.say(channel, 'Error: no tienes permisos para realizar esta acción.');
      }
    break;
    case '!nacionalidad':
    perfil.find(item => {
      if (item.username === username) {
        item.nacionalidad = tarea;
        client.say(channel, `Nacionalidad actualizada para ${username}: ${tarea}`);
      }
    });
    case '!estudiopara':
    perfil.find(item => {
      if (item.username === username) {
        item.estudiopara = tarea;
        client.say(channel, `${username} Estudia para: ${tarea}`);
      }
    });
    break;
    case '!opositopara':
    perfil.find(item => {
      if (item.username === username) {
        item.opositopara = tarea;
        client.say(channel, `${username} oposito para: ${tarea}`);
      }
    });
    break
    case '!nacimiento':
    perfil.find(item => {
      if (item.username === username) {
        const fechaRegex = /^\d{2}-\d{2}$/;

        if (fechaRegex.test(tarea)) {
          item.nacimiento = tarea;

            const [dia, mes] = item.nacimiento.split('-').map(Number);
        
            switch (mes) {
              case 3:
                item.signo = dia >= 21 ? "Aries ♈︎ " : "Piscis ♓︎ ";
                break;
              case 4:
                item.signo = dia <= 19 ? "Aries ♈︎" : "Tauro ♉︎";
                break;
              case 5:
                item.signo = dia <= 20 ? "Tauro ♉︎" : "Géminis ♊︎";                
                break;
              case 6:
                item.mpsigno = dia <= 20 ? "Géminis ♊︎" : "Cáncer ♋︎";
                break;
              case 7:
                item.signo = dia <= 22 ? "Cáncer ♋︎" : "Leo ♌︎";
                break;
              case 8:
                item.signo = dia <= 22 ? "Leo ♌︎" : "Virgo ♍︎";
                break; 
              case 9:
                item.signo = dia <= 22 ? "Virgo ♍︎" : "Libra ♎︎";
                break; 
              case 10:
                item.signo = dia <= 22 ? "Libra ♎︎" : "Escorpio ♏︎";
                break;
              case 11:
                item.signo = dia <= 21 ? "Escorpio ♏︎" : "Sagitario ♐︎";
                break;
              case 12:
                item.signo = dia <= 21 ? "Sagitario ♐︎" : "Capricornio ♑︎";
                break;
              case 1:
                item.signo = dia <= 19 ? "Capricornio ♑︎" : "Acuario ♒︎";
                break;
              case 2:
                item.signo = dia <= 18 ? "Acuario ♒︎" : "Piscis ♓︎";
                break;
              default:
                item.signo = ""; // En caso de que el mes no esté en el rango válido
            }
          
          client.say(channel, `Fecha de nacimiento actualizada para ${username}: ${tarea}. Signo zodiacal: ${item.signo}`);
        } else {
          client.say(channel, `Formato de fecha no válido. Por favor, usa el formato dd-mm.`);
        }
      }
    });
    break;
    case '!instagram':
      perfil.find(item => {
        if (item.username === username) {
          item.instagram = tarea;
          client.say(channel, `Instagram actualizado para ${username}: ${tarea}`);
        }
      });
      break;
    case '!verusuario':
    const targetUsername = tarea.toLowerCase (); // tarea contiene el nombre de usuario que quieres ver
    const targetUser = perfil.find(item => item.username === targetUsername);
    console.log(targetUsername)
    if (targetUser) {
      // Mostrar las tareas del usuario en el chat
      targetUser.tareas.forEach((tarea, index) => {
        client.say(channel, `Tarea ${index + 1}: ${tarea.tarea}`);
      });

      // Mostrar resumen del perfil del usuario
      client.say(channel, `Resumen del perfil para ${targetUsername}: Puntos - ${targetUser.puntos}, Nacionalidad - ${targetUser.nacionalidad}, Croquetas - ${targetUser.croquetasTotal}, Signo - ${targetUser.signo}, Nacimiento - ${targetUser.nacimiento}, Instagram: ${targetUser.instagram}, Ubicación ${targetUser.index}`);
      
    } else {
      client.say(channel, `No se encontró un usuario con el nombre ${targetUsername}`);
    }
    break;
    }
    return (
      <div>Controlador</div>
    )
}

export default Controlador