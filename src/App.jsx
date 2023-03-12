import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import tmi from "tmi.js";
import Controlador from "./componentes/Controlador.jsx";

class Perfil {
  constructor(username) {
    this.username = username;
    this.tareas = []
    this.actividades = 'No indicado';
    this.signo = "No indicado";
    this.puntos = 0;
    this.nacionalidad = "No indicada";
    this.nacimiento = 'Secreto';
    this.instagram = 'No indicado';
  }
}

export var perfil = JSON.parse(localStorage.getItem('perfil')) || []
function App() {


  var [classTitle, setclassTitle] = useState("font-normal text-5xl font-weight: 500; text-center text-white");
  var [classSubtitle, setclassSubtitle] = useState("font-normal text-3xl text-center  text-green-400")
  var [aStyle, setaStyle] = useState("flex items-center p-3 text-base font-bold bg-black text-green-500 rounded-lg")
  const [user, setUser] = useState('brunispet')
  const [badges, setbadges] = useState()
  const [render, setRender] = useState(Date.now());


  const guardarPerfil = (perfil) => {
    const perfilString = JSON.stringify(perfil);
    localStorage.setItem('perfil', perfilString)
  }

  useEffect(() => {
    guardarPerfil(perfil)
  }, [render])

  const usernamePerfil = (username) => perfil.find((item) => item.username === username)

  const corrobarUsername = (username) => {
    console.log('Estoy en corrobarUSername')
    console.log(usernamePerfil(username))
    if (!usernamePerfil(username)) {
      let nuevoPerfil = new Perfil(username)
      perfil.push(nuevoPerfil)
      console.log('Se ha creado un nuevo perfil')
    }
  }



  useEffect(() => {
    const client = new tmi.Client({
      options: { debug: true },
      identity: {
        username: import.meta.env.VITE_APP_USERNAME,
        password: import.meta.env.VITE_APP_PASSWORD,
      },
      channels: [import.meta.env.VITE_APP_CHANNELS]
    });

    client.connect();

    client.on("message", (channel, userstate, message, self) => {
      if (self) return;
      const username = userstate.username;
      const displayName = userstate['display-name'];
      const subs = userstate?.subscriber;
      const mod = userstate?.mod;
      const type = userstate['message-type'];
      const isSub = userstate.badges?.subscriber
      const monSubs = userstate['badge-info']?.subscriber;
      const isPrime = userstate.badges?.premium
      const isVip = userstate.badges?.vip
      const isMod = userstate.badges?.moderator
      const badges =
        (isPrime ? "👑" : "") +
        (isVip ? "💎" : "") +
        (isSub ? "🏆" : "") +
        (isMod ? "🗡️" : "");
      const args = message.slice(1).split(' ');
      const id = args[1]
      const command = message.toLowerCase().split(" ")[0];
      const tarea = message.substring(command.length + 1);
      if (username === 'brunispet') return
      if (username === 'streamelements') return
      if (username === 'nightbot') return

      switch (command) {
        case '!task':
        case '!tarea':
        case '!lista':
        case '!list':
        case '!delete':
        case '!eliminar':
        case '!check':
        case '!marcar':
        case '!clear':
        case '!pickup':
        case '!croqueta':
          console.log('Entre a este if ')
          console.log(command)
          corrobarUsername(username)
          Controlador(client, channel, command, username, tarea, id, badges)
          setUser(username)
          setbadges(badges)
          if (isPrime) { setclassTitle("mb-2 font-bold text-4xl text-center tracking-tight text-blue-200 dark:text-white"); setclassSubtitle("font-normal text-3xl text-center text-blue-100"); setaStyle("flex items-center p-3 text-base font-bold bg-black text-indigo-400 rounded-lg"); }
          if (isMod) { setclassTitle("mb-2 font-bold text-4xl text-center tracking-tight text-green-300 dark:text-white"); setclassSubtitle("font-normal text-3xl text-center text-green-100"); setaStyle("flex items-center p-3 text-base font-bold bg-black text-green-300 rounded-lg"); }
          if (isVip) { setclassTitle("mb-2 font-bold text-4xl text-center tracking-tight text-pink-600 dark:text-white"); setclassSubtitle("font-normal text-3xl text-center text-pink-800"); setaStyle("flex items-center p-3 text-base font-bold bg-black text-pink-500 rounded-lg"); }
          if (isSub) { setclassTitle("mb-2 font-bold text-4xl text-center tracking-tight text-yellow-300 dark:text-white"); setclassSubtitle("font-normal text-3xl text-center text-yellow-200"); setaStyle("flex items-center p-3 text-base font-bold bg-black text-yellow-400 rounded-lg"); }
          else {
            setclassTitle("font-normal text-5xl font-weight: 500; text-center text-white"); setclassSubtitle("font-normal text-3xl text-center  text-green-400"); setaStyle("flex items-center p-3 text-base font-bold bg-black text-green-500 rounded-lg");
          }
          break;
      }

      console.log('Este es el perfil de cuarto de chenz')
      console.log(perfil)
      setRender(Date.now())

    });
    return () => {
      client.disconnect
    }

  }, []);



  return (
    <div>
      <div className="contenedorTareas w-full p-4 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
        <h1 className={classTitle}>
          {badges}{user}{badges}
        </h1>
        <h5 className={classSubtitle}>
          Tareas pendientes:
        </h5>
        <ul className="my-4 space-y-3">
          {
            usernamePerfil(user) && (
              usernamePerfil(user).tareas.map((i, index) => (
                <li key={index}>
                  <a href="#" className={aStyle}>

                    <span className="flex-1 ml-3 overflow-hidden">{i.tarea}</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-base font-medium text-black-500 bg-gray-700 rounded dark:bg-green-700 dark:text-green-400">{i.id}</span>
                  </a>
                </li>
              ))
            )
          }
        </ul>
        <div>
          <a
            href="#"
            className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
          >
          </a>
        </div>
      </div>
    </div >
  )
}

export default App
