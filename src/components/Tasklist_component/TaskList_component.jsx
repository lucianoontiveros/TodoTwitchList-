import React from "react";

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
