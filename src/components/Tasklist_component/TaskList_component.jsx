import React from "react";
import "../Tasklist_component/TaskList_style.css";

const Tasklist_compoment = ({ user }) => {
  return (
    <>
      <h3>Pendientes</h3>
      <ul>
        {user.tasks.map((task, index) => (
          <li key={index}>
            <p> {task.description}</p>
            <strong>{task._id} </strong>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Tasklist_compoment;
