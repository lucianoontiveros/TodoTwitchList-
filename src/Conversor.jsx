import { useState } from "react";

const Conversor = () => {
  const [usersData, setUsersData] = useState(null);

  // Función para generar un ID único
  const generateUniqueId = () => Math.random().toString(36).substr(2, 9);

  // Función para transformar y guardar los usuarios
  const transformUsers = () => {
    const perfilData = JSON.parse(localStorage.getItem("perfil")) || [];

    // Transformación del perfil a la nueva estructura
    const users = perfilData.reduce((acc, perfil) => {
      acc[perfil.username] = {
        name: perfil.username,
        _id: generateUniqueId(),
        status: null,
        tasks: perfil.tareas.map((tarea) => ({
          description: tarea.tarea,
          _id: tarea.id,
          active: false,
        })),
        exams: [],
        lastTime: new Date().toISOString(),
        personaldata: [
          {
            points: perfil.puntos,
            birth: perfil.nacimiento || "",
            sign: perfil.signo,
            nationality: perfil.nacionalidad,
            instagram: perfil.instagram,
            croquetastotal: perfil.croquetasTotal,
            studyfor: perfil.estudiopara,
            oppositionfor: perfil.opositopara,
          },
        ],
        tag: "mod",
        mensaje: `${
          perfil.username
        } interactuó por última vez: ${new Date().toLocaleString()}`,
      };
      return acc;
    }, {});

    // Guardar en el estado y en localStorage
    setUsersData(users);
    localStorage.setItem("users", JSON.stringify(users, null, 2));
  };

  // Función para copiar el JSON al portapapeles
  const copyToClipboard = () => {
    if (usersData) {
      navigator.clipboard.writeText(JSON.stringify(usersData, null, 2));
      alert("JSON copiado al portapapeles");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Transformador de Usuarios</h2>
      <button onClick={transformUsers}>Transformar y Guardar Usuarios</button>

      {usersData && (
        <div>
          <button
            onClick={copyToClipboard}
            style={{ marginTop: "10px" }}
          >
            Copiar JSON
          </button>
          <pre
            style={{
              background: "#f4f4f4",
              padding: "10px",
              marginTop: "10px",
            }}
          >
            {JSON.stringify(usersData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default Conversor;
