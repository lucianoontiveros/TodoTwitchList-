import React, { useEffect, useState } from "react";
import Tasklist_component from "../Tasklist_component/TaskList_component";

// Importar fondos según rol
import { susBackgrounds } from "../../assets/susBackgrounds";
import { vipBackgrounds } from "../../assets/vipBackgrounds";
import { modBackgrounds } from "../../assets/modBackgrounds";

// Fondos base por rol
const tagBaseBackgrounds = {
  sub: susBackgrounds.sus_fondo,
  mod: modBackgrounds.mod_fondo,
  vip: vipBackgrounds.vip_fondo,
  prime: susBackgrounds.prime_fondo, // este lo puedes mover si lo separas
  viewer: susBackgrounds.viewer,
};

const InfoUser_component = ({ user, username }) => {
  const [styles, setStyles] = useState({});

  useEffect(() => {
    if (!user || !user.tag) return;

    const tagLower = user.tag.toLowerCase().trim();
    const normalizedName = user.name?.toLowerCase().trim() || "";

    // Selección del objeto según rol
    let backgroundSets = {};
    if (tagLower === "sub") backgroundSets = susBackgrounds;
    if (tagLower === "vip") backgroundSets = vipBackgrounds;
    if (tagLower === "mod") backgroundSets = modBackgrounds;

    // 1. Fondo personalizado si existe
    let backgroundImage = backgroundSets[normalizedName];

    // 2. Fondo base del rol si no hay personalizado
    if (!backgroundImage) {
      backgroundImage = tagBaseBackgrounds[tagLower] || tagBaseBackgrounds.viewer;
    }

    // Estilos finales
    setStyles({
      backgroundImage: `url(${backgroundImage})`,
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover",
      backgroundPosition: "bottom",
      borderRadius: "1em",
    });
  }, [user]);

  return (
    <div className="maincontainer">
      <div className={`infoUser_containers ${user?.tag} ${user?.name} `} style={styles}>
        <div className="container_header ">
          <div className="header_user">
            <h2>
              {username}
            </h2>
          </div>

          <div className="header_info">
            {user?.personaldata?.[0]?.birth && (
              <div className="">🎂 Cumple: {user.personaldata[0].birth}</div>
            )}
            {user?.personaldata?.[0]?.sign && (
              <div className="">Signo zodiacal: {user.personaldata[0].sign}</div>
            )}
            {user?.tasks?.length > 0 && (
              <div className="">📋 Tareas: {user.tasks.length}</div>
            )}
            {user?.exams?.length > 0 && (
              <div className="">📅 Exámenes: {user.exams.length}</div>
            )}
            {user?.personaldata?.[0]?.nationality && (
              <div className="">
                🪪 Nacionalidad: {user.personaldata[0].nationality}
              </div>
            )}
            {user?.personaldata?.[0]?.oppositionfor && (
              <div className="">
                📄 Oposito: {user.personaldata[0]?.oppositionfor}
              </div>
            )}
            {user?.personaldata?.[0]?.studyfor && (
              <div className="">
                📓 Estudio: {user.personaldata[0]?.studyfor}
              </div>
            )}
            {user?.personaldata?.[0]?.instagram && (
              <div className="">
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