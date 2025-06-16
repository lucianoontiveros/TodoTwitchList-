import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({});

  useEffect(() => {
    try {
      if (!user || !user.tag) return; // Validación antes de asignar clases

      let newClasses = {
        container: "user_fondo infoUSer_containers",
        info_items: "p-[0.2em]",
        info_title: "flex justify-center items-start px-[1em] text-center",
        info_title_h2:
          "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
        info_header: "flex flex-row flex-wrap",
        info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
        task_container: "flex flex-col justify-center",
        task_header: "task-header",
      };

      switch (user.tag) {
        case "sub":
          newClasses.container = "sus_fondo infoUSer_containers";
          switch (user.name) {
            case "mandaariina":
              newClasses.container =
                "mandaariina infoUSer_containers crema_fondo";
              break;
            case "antonellavrl_":
              newClasses.container =
                "antonellavrl_ infoUSer_containers amarrillo_fondo";
              break;
            case "summertime0805":
              newClasses.container =
                "summertime0805 infoUSer_containers magenta_fondo";
              break;
            case "gominola_opositora":
              newClasses.container =
                "gominola_opositora infoUSer_containers azul_fondo";
              break;
            case "chinita098":
              newClasses.container =
                "chinita098 infoUSer_containers rojo_fondo";
              break;
            case "agos__________":
              newClasses.container =
                "agos__________ infoUSer_containers blanco_fondo";
              break;
            case "jana10dv":
              newClasses.container = "jana10dv infoUSer_containers aqua_fondo";
              break;
            case "mont_opo":
              newClasses.container = "mont_opo infoUSer_containers crema_fondo";
              break;
            case "antof253":
              newClasses.container = "antof253 infoUSer_containers crema_fondo";
              break;
            case "rsofiaa":
              newClasses.container = "rsofiaa infoUSer_containers blanco_fondo";
              break;
            case "wandazk":
              newClasses.container =
                "wandazk infoUSer_containers amarrillo_patito_fondo";
              break;
            case "olmediito":
              newClasses.container =
                "olmediito infoUSer_containers lavanda_fondo";
              break;
            case "liln1k":
              newClasses.container =
                "liln1k infoUSer_containers amarrillo_fondo";
              break;
              case "condrocita":
              newClasses.container =
                "condrocita infoUSer_containers rosa_fondo";
              break;
              case "kakarotita_":
              newClasses.container =
                "kakarotita_  infoUSer_containers lila_fondo";
              break;
          }
          break;

        case "vip":
          newClasses.container = "vip_fondo infoUSer_containers";
          switch (user.name) {
            case "sofiaantok":
              newClasses.container =
                "sofiaantok infoUSer_containers amarrillo_fondo";
              break;
          }
          break;
        case "mod":
          newClasses.container = "mod_fondo infoUSer_containers";
          switch (user.name) {
            case "camm_sss":
              newClasses.container =
                "camm_sss infoUSer_containers orange_fondo";
              break;
            case "mont_opo":
              newClasses.container = "mont_opo infoUSer_containers crema_fondo";
              break;
            case "mandaariina":
              newClasses.container =
                "mandaariina infoUSer_containers crema_fondo";
              break;
            case "cuartodechenz":
              newClasses.container =
                "kakarotita_  infoUSer_containers lila_fondo";
              break;
              
          }
          break;
        case "prime":
          newClasses.container = "prime_fondo infoUSer_containers";
          break;
        default:
          break;
      }

      setClases(newClasses);
    } catch (error) {
      console.error("Error al asignar clases:", error);
    }
  }, [user]);

  return (
    <div className="maincontainer">
      <div className={clases.container}>
        <div className={clases.info_items}>
          <div className={clases.info_title}>
            <h2 className={clases.info_title_h2}>{username}</h2>
          </div>

          <div className={clases.info_header}>
            {(() => {
              try {
                return (
                  <>
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
                  </>
                );
              } catch (error) {
                console.error("Error al renderizar datos del usuario:", error);
                return null;
              }
            })()}
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
