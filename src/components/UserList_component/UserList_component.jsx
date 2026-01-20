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
      
      if (containerRef.current) {
        const element = containerRef.current;
        element.style.transition = 'background-color 0.2s';
        element.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        setTimeout(() => {
          element.style.backgroundColor = '';
        }, 10000);
      }
    } catch (err) {
      console.error('Error al copiar datos:', err);
    }
  }, []);

  const tasksLength = currentUser?.tasks?.length ?? 0;
  const examsLength = currentUser?.exams?.length ?? 0;
  const points = currentUser?.personaldata?.[0]?.points ?? 0;
  const croquetas = currentUser?.personaldata?.[0]?.croquetastotal ?? 0;

  const handleDeleteUser = useCallback((e) => {
    e.stopPropagation(); // Evitar que el evento se propague
    if (currentUser?.username) {
      try {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || {};
        delete storedUsers[currentUser.username];
        localStorage.setItem("users", JSON.stringify(storedUsers));
        window.dispatchEvent(new Event('storage'));
        console.log(`Usuario ${currentUser.username} eliminado`);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    }
  }, [currentUser]);

  return (
    <div className="contenedor">
      <div className="card" style={{ position: 'relative' }}>
        <button 
          onClick={handleDeleteUser}
          style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            width: '30px',
            height: '30px',
            backgroundColor: 'transparent',
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: 0,
          }}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="rgba(14, 242, 223, 0.989)"
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{
              opacity: 0.5,
              transition: 'all 0.3s ease',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.opacity = '1';
              e.currentTarget.style.stroke = '#ef4444';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.opacity = '0.5';
              e.currentTarget.style.stroke = 'rgba(14, 242, 223, 0.989)';
            }}
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

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

        {/* {tasksLength > 0 && <TaskList_component user={currentUser} />} */}

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
