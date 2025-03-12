import React, { useCallback, useRef, memo } from "react";
import TaskList_component from "../Tasklist_component/TaskList_component";
import "../UserList_component/UserList_style.css";

const UserList_component = memo(({ currentUser }) => {
  const containerRef = useRef(null);

  const handleCopyData = useCallback(async () => {
    try {
      const data = localStorage.getItem('users');
      if (!data) {
        console.warn('No hay datos para copiar');
        return;
      }

      await navigator.clipboard.writeText(data);
      
      // Feedback visual mejorado y más seguro
      if (containerRef.current) {
        const element = containerRef.current;
        element.style.transition = 'background-color 0.2s';
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 200);
      }
    } catch (err) {
      console.error('Error al copiar datos:', err);
    }
  }, []);

  // Manejo seguro de datos nulos o indefinidos
  const tasksLength = currentUser?.tasks?.length ?? 0;
  const examsLength = currentUser?.exams?.length ?? 0;
  const points = currentUser?.personaldata?.[0]?.points ?? 0;
  const croquetas = currentUser?.personaldata?.[0]?.croquetastotal ?? 0;

  return (
    <div className="contenedor">
      <div className="card">
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

        {tasksLength > 0 && <TaskList_component user={currentUser} />}

        <div 
          ref={containerRef}
          className="info_conection_container cursor-pointer" 
          onClick={handleCopyData}
          title="Haz clic para copiar datos"
        >
          <p>
            <strong>{currentUser?._id}</strong>
          </p>
          <p>
            <strong>
              {currentUser?.lastTime ? 
                new Date(currentUser.lastTime).toLocaleString() : 
                'Fecha no disponible'}
            </strong>
          </p>
        </div>
      </div>
    </div>
  );
});

UserList_component.displayName = 'UserList_component';

export default UserList_component;
