import React from "react";
import "../Tasklist_component/TaskList_style.css";

const Tasklist_compoment = ({ user }) => {
  return (
    <>
      <div className="task-header">
        <h3 className="task-header-title"> Tareas Pendientes</h3>
      </div>
      <ul className="task-list">
        {user.tasks.map((task, index) => (
          <li
            key={index}
            className="task-item"
          >
            <p className="task-description"> {task.description}</p>
            <strong className="task-id">{task._id} </strong>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tasklist_compoment;
