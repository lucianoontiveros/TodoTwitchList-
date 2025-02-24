import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({});

  console.log(user.tag);
  useEffect(() => {
    switch (user.tag) {
      case "sub":
        setClases((prevClases) => ({
          ...prevClases,
          container: "sus_fondo infoUSer_containers",
          info_items: "p-[0.2em]",
          info_title: "flex justify-center items-start px-[1em] text-center",
          info_title_h2:
            "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
          info_header: "flex flex-row flex-wrap",
          info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
          task_container: "flex flex-col justify-center",
        }));
        break;
      case "vip":
        setClases((prevClases) => ({
          ...prevClases,
          container: "vip_fondo infoUSer_containers",
          info_items: "p-[0.2em]",
          info_title: "flex justify-center items-start px-[1em] text-center",
          info_title_h2:
            "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
          info_header: "flex flex-row flex-wrap",
          info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
          task_container: "flex flex-col justify-center",
        }));
        break;
      case "mod":
        setClases((prevClases) => ({
          ...prevClases,
          container: "mod_fondo infoUSer_containers",
          info_items: "p-[0.2em]",
          info_title: "flex justify-center items-start px-[1em] text-center",
          info_title_h2:
            "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
          info_header: "flex flex-row flex-wrap",
          info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
          task_container: "flex flex-col justify-center",
        }));
        break;
      case "prime":
        setClases((prevClases) => ({
          ...prevClases,
          container: "prime_fondo infoUSer_containers",
          info_items: "p-[0.2em]",
          info_title: "flex justify-center items-start px-[1em] text-center",
          info_title_h2:
            "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
          info_header: "flex flex-row flex-wrap",
          info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
          task_container: "flex flex-col justify-center",
        }));
        break;
      default:
        setClases((prevClases) => ({
          ...prevClases,
          container: "user_fondo infoUSer_containers",
          info_items: "p-[0.2em]",
          info_title: "flex justify-center items-start px-[1em] text-center",
          info_title_h2:
            "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
          info_header: "flex flex-row flex-wrap",
          info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
          task_container: "flex flex-col justify-center",
        }));
        return;
    }
  }, []);

  return (
    <div className="maincontainer">
      <div className={clases.container}>
        <div className={clases.info_items}>
          <div className={clases.info_title}>
            <h2 className={clases.info_title_h2}>{username}</h2>
          </div>

          <div className={clases.info_header}>
            {user.personaldata[0]?.birth && (
              <div className={clases.info_header_div}>
                🎂 Cumple: {user.personaldata[0].birth}
              </div>
            )}
            {user.personaldata[0]?.sign && (
              <div className={clases.info_header_div}>
                Signo zodiacal: {user.personaldata[0].sign}
              </div>
            )}
            {user.tasks.length > 0 && (
              <div className={clases.info_header_div}>
                📋 Tareas: {user.tasks.length}
              </div>
            )}
            {user.exams.length > 0 && (
              <div className={clases.info_header_div}>
                📅 Exámenes: {user.exams.length}
              </div>
            )}
            {user.personaldata[0]?.nationality && (
              <div className={clases.info_header_div}>
                🪪 Nacionalidad: {user.personaldata[0].nationality}
              </div>
            )}
            {user.personaldata[0]?.oppositionfor && (
              <div className={clases.info_header_div}>
                📄 Oposito: {user.personaldata[0]?.oppositionfor}
              </div>
            )}
            {user.personaldata[0]?.studyfor && (
              <div className={clases.info_header_div}>
                📓 Estudio: {user.personaldata[0]?.studyfor}
              </div>
            )}
            {user.personaldata[0]?.instagram && (
              <div className={clases.info_header_div}>
                📷 Instagram: {user.personaldata[0].instagram}
              </div>
            )}
          </div>
        </div>

        <div className="task-container">
          {user.tasks.length > 0 && <Tasklist_component user={user} />}
          <div className="data">
            <p>ID: {user._id}</p>
            <p>ULTC: {user.lastTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

/* https://www.twitch.tv/luzu
  {user.tasks.length.sign != null
                ? user.tasks.length.sign == 0
                  ? "0"
                  : user.tasks.length.sign
                : "0"}
*/

export default InfoUser_component;
