import React, { useEffect, useState } from "react";
// Usar ruta absoluta desde la carpeta public para mejor compatibilidad en producción
import Tasklist_component from "../Tasklist_component/TaskList_component";

// Importar fondos según rol
import { susBackgrounds } from "../../assets/susBackgrounds";
import { vipBackgrounds } from "../../assets/vipBackgrounds";
import { modBackgrounds } from "../../assets/modBackgrounds";

// Fondos base por rol
const tagBaseBackgrounds = {
  sub: susBackgrounds.sus_fondo,
  mod: susBackgrounds.mod_fondo,
  vip: susBackgrounds.vip_fondo,
  prime: susBackgrounds.prime_fondo,
  viewer: susBackgrounds.viewer,
};

const InfoUser_component = ({ user, username }) => {
  const [styles, setStyles] = useState({});
  const [stylesTasks, setStylesTasks] = useState();
  const [showContent, setShowContent] = useState(false);

  // Delay de 2 segundos para mostrar header_info y task-container juntos
  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user || !user.tag) return;

    const tagLower = user.tag.toLowerCase().trim();
    const normalizedName = user.name?.toLowerCase().trim() || "";

    let backgroundSets = {};
    if (tagLower === "sub") backgroundSets = susBackgrounds;
    if (tagLower === "vip") backgroundSets = vipBackgrounds;
    if (tagLower === "mod") backgroundSets = modBackgrounds;

    let backgroundImage = backgroundSets[normalizedName];
    if (backgroundImage) {
      setStylesTasks(`infoUser_containers user-custom-color ${user?.name}`);
    }

    if (!backgroundImage) {
      backgroundImage = tagBaseBackgrounds[tagLower] || tagBaseBackgrounds.viewer;
      setStylesTasks(`infoUser_containers ${user?.tag}`);
    }

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
      <div className={stylesTasks} style={styles}>
        <div className="container_header">
          <div className="header_user">
            <h2>{username}</h2>
          </div>

          <div
            className={`header_info ${showContent ? "fade-in" : "hidden-section"}`}
          >
            {user?.personaldata?.[0]?.birth && (
              <div>🎂 Cumple: {user.personaldata[0].birth}</div>
            )}
            {user?.personaldata?.[0]?.sign && (
              <div>Signo zodiacal: {user.personaldata[0].sign}</div>
            )}
            {user?.tasks?.length > 0 && (
              <div>📋 Tareas: {user.tasks.length}</div>
            )}
            {user?.exams?.length > 0 && (
              <div>📅 Exámenes: {user.exams.length}</div>
            )}
            {user?.personaldata?.[0]?.nationality && (
              <div>🪪 Nacionalidad: {user.personaldata[0].nationality}</div>
            )}
            {user?.personaldata?.[0]?.oppositionfor && (
              <div>📄 Oposito: {user.personaldata[0]?.oppositionfor}</div>
            )}
            {user?.personaldata?.[0]?.studyfor && (
              <div>📓 Estudio: {user.personaldata[0]?.studyfor}</div>
            )}
            {user?.personaldata?.[0]?.instagram && (
              <div>📷 Instagram: {user.personaldata[0].instagram}</div>
            )}
          </div>
        </div>

        {/* Task container con la misma animación */}
        <div
          className={`task-container ${showContent ? "fade-in" : "hidden-section"}`}
        >
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
