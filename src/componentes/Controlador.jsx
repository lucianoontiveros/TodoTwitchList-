import React from 'react'
import { customAlphabet } from 'nanoid'
import { perfil } from '../App.jsx'
var croquetas = [];

const nanoid = customAlphabet('1234567890abcdef', 10)
const Controlador = (client, channel, command, username, tarea, id, badges) => {

  console.log('esta es la id')
  console.log(id)

  class Croquetas {
    constructor(username) {
      this.username = username;
      this.croquetasCantidad = 0;
      this.tareasRealizadas = 0;
      this.tareasEliminadas = 0;
    }
  }

  const sumarCroquetas = (cantidadDeTareas) => {
    croquetas.find(item => {
      if (item.username === username) {
        item.croquetasCantidad = item.croquetasCantidad + cantidadDeTareas
        return console.log(item.croquetasCantidad)
      }
      console.log("el usuario no tiene croquetas")
      console.log(croquetas)
    })
  }

  const usernameCroquetas = (username) => croquetas.find((item) => item.username === username)

  switch (command) {


    case '!task':
      perfil.find(item => {
        if (item.username === username) {
          item.tareas.push({ tarea, id: nanoid(3) })
          item.puntos += 50;
          client.say(channel, `/me imGlitch @${item.username} imGlitch registré tu tarea: 🐱‍💻 ${tarea}  | BegWan VirtualHug`);

        }
      })
      break;

    case '!tarea':
      perfil.find(item => {
        if (item.username === username) {
          let nuevoId = nanoid(3)
          item.tareas.push({ tarea, id: nuevoId })
          item.puntos += 50;
          client.say(channel, `/me imGlitch @${item.username} imGlitch registré tu tarea: 🐱‍💻 ${tarea} con 🔖 ${nuevoId} | BegWan VirtualHug`);

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
          var anuncio = '/me No tiene tareas que tenga recordar. !comandos para revisar todo lo que puedo hacer BegWan VirtualHug .'
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
            console.log(tareaEliminada)
            client.say(channel, `Esta tarea fue eliminada: 📖 ${tareaEliminada.tarea}  con el Id: 🔖 ${tareaEliminada.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            console.log(tareasFiltradas)
            item.tareas = tareasFiltradas
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
            client.say(channel, `This task was eliminated: 📖 ${tareaEliminada.tarea}  with the id: 🔖 ${tareaEliminada.id} `)
            const tareasFiltradas = item.tareas.filter(u => u.id !== id);
            console.log(tareasFiltradas)
            item.tareas = tareasFiltradas
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
            sumarCroquetas(1)
            console.log(croquetas)
          }
        })
      } catch (error) {
        client.say(channel, `no tengo idea que me estas pidiendo hacer. Deberias revisar el id, copiarlo al tirar el comando !lista CorgiDerp `)
      }
      break;

    case '!clear':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron eliminadas | All your tasks were deleted`)
          item.tareas = []
        }
      })
      break;

    case '!pickup':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron marcadas como realizadas | All your tasks were marked as done`)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          let cantidadDeTareas = item.tareas.length
          item.tareas = []
          sumarCroquetas(cantidadDeTareas)

        }
      })
      break;

    case '!croqueta':
      if (!usernameCroquetas(username)) {
        let nuevoCroquetas = new Croquetas(username)
        croquetas.push(nuevoCroquetas)
        return console.log('Se ha creado un nuevo comedero de croquetas')
      }
      croquetas.find(item => {
        if (item.username === username) {
          item.croquetasCantidad++
          console.log(croquetas)
        }
      })
      break;
  }
  return (
    <div>Controlador</div>
  )
}

export default Controlador
