import React, { useEffect, useState } from "react";
import TaskList_component from "../Tasklist_component/TaskList_component";
import "../Userlist_component/Userlist_style.css";

const UserList_component = ({ currentUser }) => {
  return (
    <div className="contenedor">
      <div className="card">
        <div className="title_container">
          <strong>{currentUser.username}</strong>
        </div>
        <div className="tags_container">
          <p>
            Tareas: <strong> {currentUser.tasks.length}</strong>
          </p>
          <p>
            Exámenes: <strong>{currentUser.exams.length}</strong>
          </p>
          <p>
            Points:
            <strong>{currentUser.personaldata?.[0]?.points ?? 0}</strong>
          </p>
          <p>
            Croquetas:
            <strong>
              {currentUser.personaldata?.[0]?.croquetastotal == 0
                ? currentUser.personaldata?.[0]?.croquetastotal
                : " 0"}
            </strong>
          </p>
        </div>

        {currentUser.tasks.length == 0 ? (
          ""
        ) : (
          <TaskList_component user={currentUser} />
        )}

        <div className="info_conection_container">
          <p>
            <strong>{currentUser._id} </strong>
          </p>
          <p>
            {" "}
            <strong>{new Date(currentUser.lastTime).toLocaleString()}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserList_component;
