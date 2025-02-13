import React from "react";
import TaskList_component from "../Tasklist_component/TaskList_component";

const UserList_component = ({ currentUser }) => {
  return (
    <div>
      <h2>Mostrando usuario cada 5 segundos</h2>
      <div>
        <strong>Usuario: {currentUser.username}</strong>
        <p>ID: {currentUser._id}</p>
        <p>
          Última conexión: {new Date(currentUser.lastTime).toLocaleString()}
        </p>
        <p>Tareas: {currentUser.tasks.length}</p>
        <p>Exámenes: {currentUser.exams.length}</p>
        <TaskList_component user={currentUser} />
      </div>
    </div>
  );
};

export default UserList_component;
