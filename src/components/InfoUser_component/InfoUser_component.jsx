import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

// Mapeo de clases por tag y nombre
const tagBaseClasses = {
  sub: "sus_fondo infoUSer_containers",
  mod: "mod_fondo infoUSer_containers",
  vip: "vip_fondo infoUSer_containers",
  prime: "prime_fondo infoUSer_containers",
};

const userSpecificClasses = {
  sub: {
    mandaariina: "infoUSer_containers mandaariina",
    antonellavrl_: "infoUSer_containers antonellavrl_",
    summertime0805: "infoUSer_containers summertime0805",
    gominola_opositora: "infoUSer_containers gominola_opositora",
    chinita098: "infoUSer_containers chinita098",
    agos__________: "infoUSer_containers agos__________",
    jana10dv: "infoUSer_containers jana10dv",
    mont_opo: "infoUSer_containers mont_opo",
    antof253: "infoUSer_containers antof253",
    rsofiaa: "infoUSer_containers rsofiaa",
    wandazk: "infoUSer_containers wandazk",
    olmediito: "infoUSer_containers olmediito",
    liln1k: "infoUSer_containers liln1k",
    condrocita: "infoUSer_containers condrocita",
    kakarotita_: "infoUSer_containers kakarotita_",
    karlitarachel: "infoUSer_containers karlitarachel",
    ruidodemate_rocio: "infoUSer_containers ruidodemate_rocio",
    crissworkoutt: "infoUSer_containers crissworkoutt",
    sofamb1: "infoUSer_containers sofamb1",
    macacuelloo: "infoUSer_containers macacuelloo",
    bleisny: "infoUSer_containers bleisny",
    mariong898: "infoUSer_containers mariong898",
    valenm07: "infoUSer_containers valenm07",
    flavia_2025_: "infoUSer_containers flavia_2025_",
  },
  vip: {
    mariong898: "infoUSer_containers mariong898",
    sofiaantok: "infoUSer_containers sofiaantok",
    flavia_2025_: "infoUSer_containers flavia_2025_",
    
  },
  mod: {
    agos__________: "infoUSer_containers agos__________",
    camm_sss: "infoUSer_containers camm_ssss",
    mont_opo: "infoUSer_containers mont_opo",
    mandaariina: "infoUSer_containers mandaariina",
    cuartodechenz: "infoUSer_containers prime_fondo",
  },
};

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({});

  useEffect(() => {
    if (!user || !user.tag) return;


    // Valores base comunes
    let newClasses = {
      container: "user_fondo infoUSer_containers",
      info_items: "p-[0.2em]",
      info_title: "flex justify-center items-start px-[1em] text-center",
      info_title_h2: "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
      info_header: "flex flex-row flex-wrap",
      info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
      task_container: "flex flex-col justify-center",
      task_header: "task-header",
    };

    const normalizedName = user.name?.toLowerCase().trim() || '';
    
    console.log('=== DEPURACIÓN DE CLASES ===');
    console.log('Nombre original:', `"${user.name}"`);
    console.log('Nombre normalizado:', `"${normalizedName}"`);
    console.log('Tag del usuario:', `"${user.tag}"`);
    
    // Verificar si el usuario está en userSpecificClasses
    console.log('Clases específicas disponibles para este tag:', Object.keys(userSpecificClasses[user.tag] || {}));
    console.log('El usuario tiene clase específica?', !!userSpecificClasses[user.tag]?.[normalizedName]);
    
    if (userSpecificClasses[user.tag]?.[normalizedName]) {
      console.log('Clase específica encontrada:', userSpecificClasses[user.tag][normalizedName]);
    }
    // Primero intentamos encontrar una clase específica para el usuario
    if (userSpecificClasses[user.tag]?.[normalizedName]) {
      console.log(`Clase específica encontrada para ${normalizedName} (${user.tag}):`, userSpecificClasses[user.tag][normalizedName]);
      newClasses.container = userSpecificClasses[user.tag][normalizedName];
    } 
    // Si no hay clase específica, usamos la clase base del tag
    else if (tagBaseClasses[user.tag]) {
      console.log(`Usando clase base para tag ${user.tag}`);
      newClasses.container = tagBaseClasses[user.tag];
    }
    
    // Verificación final
    console.log('Clase final asignada:', newClasses.container);
    setClases(newClasses);

    

  }, [user]);

  return (
    <div className="maincontainer">
      <div className={clases.container}>
        <div className={clases.info_items}>
          <div className={clases.info_title}>
            <h2 className={clases.info_title_h2}>{username}</h2>
          </div>

          <div className={clases.info_header}>
            {user?.personaldata?.[0]?.birth && (
              <div className={clases.info_header_div}>
                🎂 Cumple: {user.personaldata[0].birth}
              </div>
            )}
            {user?.personaldata?.[0]?.sign && (
              <div className={clases.info_header_div}>
                Signo zodiacal: {user.personaldata[0].sign}
              </div>
            )}
            {user?.tasks?.length > 0 && (
              <div className={clases.info_header_div}>
                📋 Tareas: {user.tasks.length}
              </div>
            )}
            {user?.exams?.length > 0 && (
              <div className={clases.info_header_div}>
                📅 Exámenes: {user.exams.length}
              </div>
            )}
            {user?.personaldata?.[0]?.nationality && (
              <div className={clases.info_header_div}>
                🪪 Nacionalidad: {user.personaldata[0].nationality}
              </div>
            )}
            {user?.personaldata?.[0]?.oppositionfor && (
              <div className={clases.info_header_div}>
                📄 Oposito: {user.personaldata[0]?.oppositionfor}
              </div>
            )}
            {user?.personaldata?.[0]?.studyfor && (
              <div className={clases.info_header_div}>
                📓 Estudio: {user.personaldata[0]?.studyfor}
              </div>
            )}
            {user?.personaldata?.[0]?.instagram && (
              <div className={clases.info_header_div}>
                📷 Instagram: {user.personaldata[0].instagram}
              </div>
            )}
          </div>
        </div>

        <div className="task-container">
          {user?.tasks?.length > 0 && <Tasklist_component user={user} />}
          <div className="data">
            <p>ID: {user?._id || "Desconocido"}</p>
            <p>ULTC: {user?.lastTime || "No disponible"}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoUser_component;