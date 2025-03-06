import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

const InfoUser_component = ({ user, username }) => {
  const [clases, setClases] = useState({});

  useEffect(() => {
    try {
      if (!user?.tag) return; // Validación antes de asignar clases

      // Definir clases predeterminadas
      const newClasses = {
        container: "user_fondo infoUSer_containers",
        info_items: "p-[0.2em]",
        info_title: "flex justify-center items-start px-[1em] text-center",
        info_title_h2:
          "m-3 text-3xl h-[1.5em] w-[12em] rounded-[0.2em] bg-black",
        info_header: "flex flex-row flex-wrap",
        info_header_div: "px-[1em] m-[0.3em] rounded-[1em] bg-black",
        task_container: "flex flex-col justify-center",
      };

      // Asignar clases según el tag del usuario
      const tagClasses = {
        sub: "sus_fondo infoUSer_containers",
        vip: "vip_fondo infoUSer_containers",
        mod: "mod_fondo infoUSer_containers",
        prime: "prime_fondo infoUSer_containers",
      };

      newClasses.container = tagClasses[user.tag] || newClasses.container;

      setClases(newClasses);
    } catch (error) {
      console.error("Error al asignar clases:", error);
    }
  }, [user]);

  // Validación antes de renderizar
  if (!user) return null;

  const personalData = user?.personaldata?.[0] || {};
  const { birth, sign, nationality, oppositionfor, studyfor, instagram } =
    personalData;

  const userInfo = [
    { label: "🎂 Cumple", value: birth },
    { label: "Signo zodiacal", value: sign },
    { label: "📋 Tareas", value: user?.tasks?.length },
    { label: "📅 Exámenes", value: user?.exams?.length },
    { label: "🪪 Nacionalidad", value: nationality },
    { label: "📄 Oposito", value: oppositionfor },
    { label: "📓 Estudio", value: studyfor },
    { label: "📷 Instagram", value: instagram },
  ];

  return (
    <div className="maincontainer">
      <div className={clases.container}>
        <div className={clases.info_items}>
          <div className={clases.info_title}>
            <h2 className={clases.info_title_h2}>{username}</h2>
          </div>

          <div className={clases.info_header}>
            {userInfo.map(({ label, value }, index) =>
              value ? (
                <div
                  key={index}
                  className={clases.info_header_div}
                >
                  {label}: {value}
                </div>
              ) : null
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
