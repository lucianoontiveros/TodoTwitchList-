import React from 'react'
import { customAlphabet } from 'nanoid'
import { perfil } from '../App.jsx'

const nanoid = customAlphabet('1234567890abcdef', 10)
const Controlador = (client, channel, command, username, tarea, id, badges) => {

  console.log('esta es la id')
  console.log(id)

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
            client.say(channel, `/me imGlitch @${username} imGlitch TAREA: 📖  ${i.tarea} 🔖 !marcar ${i.id} !eliminar ${i.id} BegWan`)
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
            client.say(channel, `/me imGlitch @${username} imGlitch TAREA: 📖  ${i.tarea} 🔖 !marcar ${i.id} !eliminar ${i.id} BegWan`)
          })
          var anuncio = '/me No tiene tareas que tenga recordar. !comandos para revisar todo lo que puedo hacer BegWan VirtualHug .'
          if (item.tareas.length === 0) {
            return client.say(channel, anuncio)
          }
        }
      })
      break;


    case '!delete':
      perfil.find(item => {
        if (item.username === username) {
          const tareaEliminada = item.tareas.find(u => u.id === id)
          console.log('Esta es la variable tarea Eliminada')
          console.log(tareaEliminada)
          client.say(channel, `Esta tarea fue eliminada: 📖 ${tareaEliminada.tarea}  con el Id: 🔖 ${tareaEliminada.id} `)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          console.log(tareasFiltradas)
          item.tareas = tareasFiltradas
        }
      })
      break;

    case '!eliminar':
      perfil.find(item => {
        if (item.username === username) {
          const tareaEliminada = item.tareas.find(u => u.id === id)
          console.log('Esta es la variable tarea Eliminada')
          console.log(tareaEliminada)
          client.say(channel, `Esta tarea fue eliminada: 📖 ${tareaEliminada.tarea}  con el Id: 🔖 ${tareaEliminada.id} `)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          console.log(tareasFiltradas)
          item.tareas = tareasFiltradas
        }
      })
      break;

    case '!check':
      perfil.find(item => {
        if (item.username === username) {
          const taskCheck = item.tareas.find(u => u.id === id)
          client.say(channel, `Esta tarea fue marcada: 📖  ${taskCheck.tarea}  con el Id:  🔖 ${taskCheck.id} `)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          console.log(tareasFiltradas)
          item.tareas = tareasFiltradas
        }
      })
      break;

    case '!marcar':
      perfil.find(item => {
        if (item.username === username) {
          const taskCheck = item.tareas.find(u => u.id === id)
          client.say(channel, `Esta tarea fue marcada: 📖  ${taskCheck.tarea}  con el Id:  🔖 ${taskCheck.id} `)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          console.log(tareasFiltradas)
          item.tareas = tareasFiltradas
        }
      })
      break;

    case '!clear':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron eliminadas`)
          item.tareas = []
        }
      })
      break;

    case '!pickup':
      perfil.find(item => {
        if (item.username === username) {
          client.say(channel, `Todas tus tareas fueron marcadas`)
          const tareasFiltradas = item.tareas.filter(u => u.id !== id);
          item.tareas = []
        }
      })
      break;
  }
  return (
    <div>Controlador</div>
  )
}

export default Controlador
