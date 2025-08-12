import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

// Mapeo de clases por tag y nombre
const tagBaseClasses = {
  sub: "sus_fondo infoUSer_containers",
  vip: "vip_fondo infoUSer_containers",
  mod: "mod_fondo infoUSer_containers",
  prime: "prime_fondo infoUSer_containers",
};

const userSpecificClasses = {
  sub: {
    mandaariina: "mandaariina infoUSer_containers crema_fondo",
    antonellavrl_: "antonellavrl_ infoUSer_containers amarrillo_fondo",
    summertime0805: "summertime0805 infoUSer_containers magenta_fondo",
    gominola_opositora: "gominola_opositora infoUSer_containers azul_fondo",
    chinita098: "chinita098 infoUSer_containers rojo_fondo",
    agos__________: "agos__________ infoUSer_containers blanco_fondo",
    jana10dv: "jana10dv infoUSer_containers aqua_fondo",
    mont_opo: "mont_opo infoUSer_containers crema_fondo",
    antof253: "antof253 infoUSer_containers crema_fondo",
    rsofiaa: "rsofiaa infoUSer_containers blanco_fondo",
    wandazk: "wandazk infoUSer_containers amarrillo_patito_fondo",
    olmediito: "olmediito infoUSer_containers lavanda_fondo",
    liln1k: "liln1k infoUSer_containers amarrillo_fondo",
    condrocita: "condrocita infoUSer_containers rosa_fondo",
    kakarotita_: "kakarotita_  infoUSer_containers lila_fondo",
    karlitarachel: "karlitarachel infoUSer_containers blanco_rosa_fondo",
    ruidodemate_rocio: "ruidodemate_rocio infoUSer_containers naranja_fondo",
    crissworkoutt: "crissworkoutt infoUSer_containers rosa_fondo",
    sofamb1: "sofamb1 infoUSer_containers azul_gris_fondo",
    macacuelloo: "macacuelloo infoUSer_containers rosa_fondo",
    bleisny: "bleisny infoUSer_containers verde_fondo ",
    mariong898: "infoUSer_containers mariong898 mostaza_fondo",
    valenm07: "valenm07 infoUSer_containers claridad_fondo",
  },
  vip: {
    sofiaantok: "sofiaantok infoUSer_containers amarrillo_fondo",
    flavia_2025_: "infoUSer_containers flavia_2025_ flavia_fondo",
  },
  mod: {
    camm_sss: "camm_sss infoUSer_containers orange_fondo",
    mont_opo: "mont_opo infoUSer_containers crema_fondo",
    mandaariina: "mandaariina infoUSer_containers crema_fondo",
    cuartodechenz: "valenm07 infoUSer_containers claridad_fondo",

  },
};

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState([]);

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

    const tagKey = String(user.tag).trim().toLowerCase();
    const nameKey = String(user.name).trim().toLowerCase();



    // Asigna clase por tag
    if (tagBaseClasses[tagKey]) {
      newClasses.container = tagBaseClasses[tagKey];
    }

    
    // Sino, usa la clase específica normal
    else if (userSpecificClasses[tagKey]?.[nameKey]) {
      newClasses.container = userSpecificClasses[tagKey][nameKey];
    }

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