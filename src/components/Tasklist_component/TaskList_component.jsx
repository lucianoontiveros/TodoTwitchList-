import React from "react";

const Tasklist_compoment = ({ user }) => {
  return (
    <ul>
      {user.tasks.map((task, index) => (
        <li key={index}>
          <strong>Tarea {index + 1}:</strong> {task.description}
        </li>
      ))}
    </ul>
  );
};

export default Tasklist_compoment;
