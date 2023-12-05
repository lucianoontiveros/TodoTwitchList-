import React, { useEffect, useState } from "react";
import { render } from "react-dom";
import tmi from "tmi.js";
import Controlador from "./componentes/Controlador.jsx";
import mod from "./img/mod.png"
import prime from "./img/prime.png"
import sub from "./img/sub.png"
import vip from "./img/vip.png"

class Perfil {
  constructor(username) {
    this.username = username;
    this.tareas = [];
    this.signo = "";
    this.puntos = 0;
    this.nacionalidad = "";
    this.nacimiento = "";
    this.instagram = "";
    this.opositopara = "";
    this.estudiopara = "";
    this.croquetasTotal = 0;
    this.index = "No establecido";
  }
  
}

export var perfil = JSON.parse(localStorage.getItem('perfil')) || [];

function App() {
  const [clases, setClases] = useState({
    title:"mb-2  font-normal text-5xl font-weight: 500; text-center text-white",
    subtitle: "font-normal text-3xl text-center  text-purple-400",
    style: "flex items-center p-3 text-base font-bold bg-black text-purple-500 rounded-lg",
    container:"",

  });
  const [infoUsuario, setInfoUsuario] = useState({
    user: "brunispet",
    isSub: false,
    isPrime: false,
    isVip: false,
    isMod: false,
    index:"",
  });
  const [infoTareas, setInfoTareas] = useState({
    showTasks:false,
    currentProfileIndex: 0,
    usuarioNuevo: [],
  });
  const [render, setRender] = useState(Date.now());
  let usuarioConTareas = []
  
  const usernamePerfil = (username) => perfil.find((item) => item.username === username)
  let taskTimeout;
  let showTasksInterval;

  const guardarPerfil = (perfil) => {
    const perfilString = JSON.stringify(perfil);
    localStorage.setItem('perfil', perfilString)
  }

  useEffect(() => {
    guardarPerfil(perfil)
  }, [render])

  const perfilesConTareas = () => perfil.filter((item) =>  {
    if(item.tareas.length > 0) {
      console.log(item)
      usuarioConTareas.push(item)
    }
  })
  
  const corrobarUsername = (username) => {
    if (!usernamePerfil(username)) {
      let nuevoPerfil = new Perfil(username)
      perfil.push(nuevoPerfil)
    }
  }

  const actualizarEstado = (username , isSub, isPrime, isVip, isMod, badgesClases) => {
    const indexEnPerfil = perfil.findIndex(item => item.username === username);
    usernamePerfil(username).index = indexEnPerfil;
    setInfoTareas((prevInfoTareas) => ({
      ...prevInfoTareas,
      showTasks:true,
    }));
    setInfoUsuario((prevInfoUsuario) => ({
      ...prevInfoUsuario,
      user:username,
      isSub: isSub,
      isPrime: isPrime,
      isVip: isVip,
      isMod: isMod,
      index: indexEnPerfil,
    }));
    console.log(badgesClases)
    switch(badgesClases){
      case "prime": 
        setClases((prevClases) => ({
          ...prevClases,
          title:"mb-2 font-bold text-4xl text-center tracking-tight text-blue-600 dark:text-white",
          subtitle: "font-normal text-3xl text-center text-blue-200",
          style: "flex items-center p-3 text-base font-bold bg-black text-blue-200 rounded-lg",
          container:"flex flex-wrap items-center text-xl text-indigo-100 p-3 font-bold bg-gradient-to-r from-blue-600 to-indigo-900 rounded-lg",
      }))
      break;
      case "mod": 
        setClases((prevClases) => ({
          ...prevClases,
          title:"mb-2 font-bold text-4xl text-center tracking-tight text-green-400 dark:text-white",
          subtitle: "font-normal text-3xl text-center text-green-100",
          style: "flex items-center p-3 text-base font-bold bg-black text-green-300 rounded-lg",
          container:"flex flex-wrap items-center text-xl text-indigo-100 p-3 font-bold bg-gradient-to-r from-green-600 to-green-900 rounded-lg"
      }))
        break;
      case "vip":
        setClases((prevClases) => ({
          ...prevClases,
          title:"mb-2 font-bold text-4xl text-center tracking-tight text-pink-600 dark:text-white",
          subtitle: "font-normal text-3xl text-center text-pink-800",
          style: "flex items-center p-3 text-base font-bold bg-black text-pink-500 rounded-lg",
          container:"flex flex-wrap items-center text-xl text-indigo-100 p-3 font-bold bg-gradient-to-r from-pink-600 to-purple-900 rounded-lg"
        }))
        break;
      case "sub":
        setClases((prevClases) => ({
          ...prevClases,
          title:"mb-2 font-bold text-4xl text-center tracking-tight text-purple-900 dark:text-white",
          subtitle: "font-normal text-3xl text-center text-blue-300",
          style: "flex items-center p-3 text-base font-bold bg-black text-blue-200 rounded-lg",
          container:"flex flex-wrap items-center text-xl text-blue-300 p-3 font-bold bg-gradient-to-r from-gray-700 to-purple-900 rounded-lg",
        }))
      break;
      default:
        setClases((prevClases) => ({
          ...prevClases,
          title:"mb-2  font-normal text-5xl font-weight: 500; text-center text-white",
          subtitle: "font-normal text-3xl text-center  text-purple-400",
          style: "flex items-center p-3 text-base font-bold bg-black text-purple-500 rounded-lg",
          container:"flex flex-wrap items-center text-xl text-indigo-100 p-3 font-bold bg-gradient-to-r from-purple-800 to-blue-900 rounded-lg",
        }))
      }
  };

  useEffect(() => {
    const client = new tmi.Client({
      options: { debug: false },
      identity: {
        username: import.meta.env.VITE_APP_USERNAME,
        password: import.meta.env.VITE_APP_PASSWORD,
      },
      channels: [import.meta.env.VITE_APP_CHANNELS]
    });

    client.connect(); 

    const startInterval = () => {
      if(usuarioConTareas.length == 0){
        perfilesConTareas();
      }
      showTasksInterval = setInterval(() => {
        // Cuando se completa de recorrer el array objetos
        if (usuarioConTareas.length == infoTareas.currentProfileIndex){
          infoTareas.currentProfileIndex = 0;
        }
        let usuarioInterado = usuarioConTareas[infoTareas.currentProfileIndex];
        // Cuando todavia no  completa de recorrer el array objetos
        setInfoTareas((prevInfoTareas) => ({
          ...prevInfoTareas,
          usuarioNuevo: usuarioInterado,
          currentProfileIndex: infoTareas.currentProfileIndex++
        }))
      }, 10000);
    };
      
    startInterval()
    
    client.on("message", (channel, userstate, message, self) => {
      if (self) return;
      /* 
      const displayName = userstate['display-name'];
      const subs = userstate?.subscriber;
      const mod = userstate?.mod;
      const type = userstate['message-type'];
      const monSubs = userstate['badge-info']?.subscriber;
      
      */
      var username = userstate.username;
      const isSub = userstate.badges?.subscriber
      const  isPrime = userstate.badges?.premium
      const isVip = userstate.badges?.vip
      const isMod = userstate.badges?.moderator
      const badgesClases = 
      (isPrime ? "prime" : "") ||
        (isVip ? "vip" : "") ||
        (isSub ? "sub" : "") ||
        (isMod ? "mod" : "");

      const args = message.slice(1).split(' ');
      const id = args[1];
      const command = message.toLowerCase().split(" ")[0];
      const tareaSinMayuscula = message.substring(command.length + 1);
      const tarea = tareaSinMayuscula.charAt(0).toUpperCase() + tareaSinMayuscula.slice(1);
      const isBot = ['brunispet', 'streamelements', 'nightbot'].includes(username);
      if (isBot) return;
      switch (command) {
        case '!task':
        case '!tarea':
        case '!lista':
        case '!delete':
        case '!eliminar':
        case '!check':
        case '!marcar':
        case '!clear':
        case '!pickup':
        case '!list':
        case '!croqueta':
        case '!nacionalidad':
        case '!nacimiento':
        case '!instagram':
        case '!eliminarusuario':
        case '!estudiopara':
        case '!opositopara':
        case '!verusuario':
        corrobarUsername(username)
        actualizarEstado(username , isSub, isPrime, isVip, isMod, badgesClases)
        Controlador(client, channel, command, username, tarea, id,clases, infoUsuario, infoTareas, usuarioConTareas)
        clearTimeout(taskTimeout);
        clearInterval(showTasksInterval);
        
        taskTimeout = setTimeout(() => {
            setInfoTareas((prevInfoTareas) => ({
              ...prevInfoTareas,
              showTasks:false,
            }));
            setClases((prevClases) => ({
              ...prevClases,
              title:"font-normal text-5xl font-weight: 500; text-center text-white",
              subtitle: "font-normal text-3xl text-center  text-blue-400",
              style: "flex items-center p-3 text-base font-bold bg-black text-blue-500 rounded-lg",
              container:"flex flex-wrap items-center text-xl text-indigo-100 p-3 font-bold bg-gradient-to-r from-purple-800 to-blue-900 rounded-lg",
            }))
            startInterval()
          }, 15000);
          console.log(perfil)
        break;
      }
      setRender(Date.now())
    });
    return () => {
      clearTimeout(taskTimeout);
      clearInterval(showTasksInterval);
      client.disconnect();
    }
  }, []);

  

  return (
      <>
      {infoTareas.showTasks && (
        <div className="contenedorTareas w-full p-4 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
          <h1 className={clases.title}>
            {infoUsuario.user}
          </h1>
          <h5 className={clases.subtitle}>
            Tareas pendientes:
          </h5>
          <ul className="my-4 space-y-3">
            {infoTareas.showTasks && usernamePerfil(infoUsuario.user) && (
              usernamePerfil(infoUsuario.user).tareas.map((i, index) => (
                <li key={index}>
                  <a href="#" className={clases.style}>
                    <span className="flex-1 text-1xl ml-3 overflow-hidden">{i.tarea}</span>
                    <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-base font-medium text-black-500 bg-gray-700 rounded dark:bg-green-700 dark:text-green-400">{i.id}</span>
                  </a>
                </li>
              ))
            )}
          </ul>
          <div>
            <a
              href="#"
              className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
            >
            </a>
            <span className={clases.container}>
              <a className="flex p-3   w-full mx-2.5 bg-black items-center text-xl0 rounded-lg" >
                { infoUsuario.isPrime ? (<img id="insignia" src={prime} />) : ("")} 
                { infoUsuario.isSub ? (<img id="insignia" src={sub} />) : ("")} 
                { infoUsuario.isMod ? (<img id="insignia" src={mod} />) : ("")} 
                { infoUsuario.isVip ? (<img id="insignia" src={vip} />) : ("")} 
                {infoUsuario.user} 🐾 {infoUsuario.index}</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) ? `🎂 !nacimiento ` + usernamePerfil(infoUsuario.user).nacimiento : "" }</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) && usernamePerfil(infoUsuario.user).signo ?  usernamePerfil(infoUsuario.user).signo : "" }</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) && usernamePerfil(infoUsuario.user).nacionalidad ? ` 📡 !nacionalidad ` + usernamePerfil(infoUsuario.user).nacionalidad : "" }</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) && usernamePerfil(infoUsuario.user).instagram ? ` 📷 !instagram ` + usernamePerfil(infoUsuario.user).instagram : "" }</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) && usernamePerfil(infoUsuario.user).estudiopara ? ` 🏦 !estudiopara ` + usernamePerfil(infoUsuario.user).estudiopara : ""}</a>
              <a className="flex overflow-hidden text-base p-1 mx-0.5">{usernamePerfil(infoUsuario.user) && usernamePerfil(infoUsuario.user).opositopara ? ` 🏦 !opositopara ` + usernamePerfil(infoUsuario.user).opositopara : ""}</a>
            </span>
          </div>
        </div>
      )}
      
      {!infoTareas.showTasks && (
        <>
          {infoTareas.usuarioNuevo.username ? (
            <div className="contenedorTareas w-full p-4 rounded-lg shadow sm:p-6 dark:bg-gray-800 dark:border-gray-700">
                <>
                <h1 className={clases.title}>
                  {infoTareas.usuarioNuevo.username}
                </h1>
                <h5 className={clases.subtitle}>
                    Tareas pendientes
                </h5>
                <ul className="my-4 space-y-3">
                  {infoTareas.usuarioNuevo.tareas ? (
                    infoTareas.usuarioNuevo.tareas.map((i, index) => (
                      <li key={index}>
                        <a key={index} href="#" className={clases.style}>
                          <span className="flex-1 ml-3 overflow-hidden">{i.tarea}</span>
                          <span className="inline-flex items-center justify-center px-2 py-0.5 ml-3 text-base font-medium text-black-500 bg-gray-700 rounded dark:bg-green-700 dark:text-green-400">{i.id}</span>
                        </a>
                      </li>
                    ))
                  ) : (
                    ""
                  )}
                </ul>
                <div>
                  <a
                    href="#"
                    className="inline-flex items-center text-xs font-normal text-gray-500 hover:underline dark:text-gray-400"
                  >
                  </a>
                </div>
                </>
              </div> 
            ):(<h5 className={clases.subtitle}> Iniciando </h5>)}        
        </>
      )}
    </>
  )
}

export default App



