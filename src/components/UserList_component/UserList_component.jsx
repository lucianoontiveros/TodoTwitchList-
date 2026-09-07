import React, { useCallback, useRef, memo, useState, useEffect } from "react";
import TaskList_component from "../Tasklist_component/TaskList_component";
import "../UserList_component/UserList_style.css";

const ExamTicker = () => {
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const loadExams = () => {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
        const allExams = [];

        Object.entries(storedUsers).forEach(([username, userData]) => {
          if (userData.exams && userData.exams.length > 0) {
            userData.exams.forEach((exam) => {
              // Filtrar solo exámenes a partir de hoy
              const [day, month] = exam.dateExam.split("-").map(Number);
              const today = new Date();
              const examDate = new Date(today.getFullYear(), month - 1, day);
              const todayWithoutTime = new Date(
                today.getFullYear(),
                today.getMonth(),
                today.getDate()
              );

              if (examDate >= todayWithoutTime) {
                allExams.push({
                  username,
                  ...exam,
                });
              }
            });
          }
        });

        setExams(allExams);
      } catch (error) {
        console.error("Error loading exams:", error);
      }
    };

    loadExams();

    const handleStorageChange = (e) => {
      if (e.key === "users") {
        loadExams();
      }
    };

    // Mismo motivo que en UserList.jsx: "usersUpdated" es el evento que
    // realmente se dispara en esta misma pestaña cuando el bot guarda cambios.
    const handleUsersUpdated = () => loadExams();

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("usersUpdated", handleUsersUpdated);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("usersUpdated", handleUsersUpdated);
    };
  }, []);

  const getExamColor = (examDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Parsear fecha en formato dd-mm
    const [day, month] = examDate.split("-").map(Number);
    const exam = new Date(today.getFullYear(), month - 1, day);
    exam.setHours(0, 0, 0, 0);

    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0 || diffDays === 1) {
      return "#ef4444"; // Rojo: hoy o mañana
    } else if (diffDays <= 3) {
      return "#eab308"; // Amarillo: dentro de 3 días
    } else {
      return "#ffffff"; // Blanco: otros casos
    }
  };

  const formatDate = (dateString) => {
    // Formato dd-mm a dd/mm/aa
    const [day, month] = dateString.split("-");
    return `${day}/${month}/${new Date().getFullYear().toString().slice(-2)}`;
  };

  if (exams.length === 0) {
    return null;
  }

  return (
    <div className="exam-ticker">
      <div className="ticker-content">
        {exams.map((exam, index) => (
          <span
            key={index}
            className="ticker-item"
            style={{ color: getExamColor(exam.dateExam) }}
          >
            📅 {formatDate(exam.dateExam)} 👤 {exam.username} 📝{" "}
            {exam.typeExam || "Examen"}: {exam.titleExam || "Sin nombre"}
          </span>
        ))}
        {exams.map((exam, index) => (
          <span
            key={`duplicate-${index}`}
            className="ticker-item"
            style={{ color: getExamColor(exam.dateExam) }}
          >
            📅 {formatDate(exam.dateExam)} 👤 {exam.username} 📝{" "}
            {exam.typeExam || "Examen"}: {exam.titleExam || "Sin nombre"}
          </span>
        ))}
      </div>
    </div>
  );
};

const UserList_component = memo(({ currentUser }) => {
  const containerRef = useRef(null);

  const handleCopyData = useCallback(async () => {
    try {
      const data = localStorage.getItem("users");
      if (!data) {
        console.warn("No hay datos para copiar");
        return;
      }

      await navigator.clipboard.writeText(data);

      if (containerRef.current) {
        const element = containerRef.current;
        element.style.transition = "background-color 0.2s";
        element.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
        setTimeout(() => {
          element.style.backgroundColor = "";
        }, 10000);
      }
    } catch (err) {
      console.error("Error al copiar datos:", err);
    }
  }, []);

  const tasksLength = currentUser?.tasks?.length ?? 0;
  const examsLength = currentUser?.exams?.length ?? 0;
  const points = currentUser?.personaldata?.[0]?.points ?? 0;
  const croquetas = currentUser?.personaldata?.[0]?.croquetastotal ?? 0;

  const handleDeleteUser = useCallback(
    (e) => {
      e.stopPropagation(); // Evitar que el evento se propague
      if (currentUser?.username) {
        try {
          const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
          delete storedUsers[currentUser.username];
          localStorage.setItem("users", JSON.stringify(storedUsers));
          window.dispatchEvent(new Event("storage"));
          console.log(`Usuario ${currentUser.username} eliminado`);
        } catch (error) {
          console.error("Error al eliminar usuario:", error);
        }
      }
    },
    [currentUser]
  );

  return (
    <div className="contenedor">
      <div
        className="card"
        style={{ position: "relative" }}
      >
        <button
          onClick={handleDeleteUser}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            width: "32px",
            height: "32px",
            backgroundColor: "rgba(14, 242, 223, 0.1)",
            border: "2px solid rgba(14, 242, 223, 0.5)",
            borderRadius: "50%",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: 0,
            transition: "all 0.3s ease",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(239, 68, 68, 0.2)";
            e.currentTarget.style.borderColor = "#ef4444";
            e.currentTarget.querySelector('svg').style.stroke = "#ef4444";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.backgroundColor = "rgba(14, 242, 223, 0.1)";
            e.currentTarget.style.borderColor = "rgba(14, 242, 223, 0.5)";
            e.currentTarget.querySelector('svg').style.stroke = "rgba(14, 242, 223, 0.8)";
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="rgba(14, 242, 223, 0.8)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              transition: "all 0.3s ease",
            }}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="header-container">
          <div className="title_container">
            <strong>{currentUser?.username}</strong>
          </div>
          <div className="tags_container">
            <p>
              Tareas: <strong>{tasksLength}</strong>
            </p>
            <p>
              Exámenes: <strong>{examsLength}</strong>
            </p>
            <p>
              Puntos: <strong>{points}</strong>
            </p>
            <p>
              Croquetas: <strong>{croquetas}</strong>
            </p>
          </div>
        </div>

        <div
          ref={containerRef}
          className="info_conection_container cursor-pointer"
          onClick={handleCopyData}
          title="Haz clic para copiar datos"
        >
          <p>
            <strong>ID: </strong>
            <span>{currentUser?._id}</span>
          </p>
          <p>
            <strong>Última conexión: </strong>
            <span>
              {currentUser?.lastTime
                ? new Date(currentUser.lastTime).toLocaleString()
                : "Fecha no disponible"}
            </span>
          </p>
        </div>
      </div>
      <ExamTicker />
    </div>
  );
});

UserList_component.displayName = "UserList_component";

export default UserList_component;
