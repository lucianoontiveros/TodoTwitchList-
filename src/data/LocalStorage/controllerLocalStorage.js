import { saveAs } from "file-saver";

const users = JSON.parse(localStorage.getItem("users")) || {};

// Registro de usuarios en localStorage
const registrationUsers = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

const saveLocalStorageFile = () => {
  const localStorageData = JSON.stringify(localStorage, null, 2);
  const blob = new Blob([localStorageData], {
    type: "text/plain;changeNameUser",
  });
  saveAs(blob, "localStorage.txt");
};

const loadLocalStorageFromFile = (jsonData) => {
  try {
    Object.keys(jsonData).forEach((key) => {
      localStorage.setItem(key, jsonData[key]);
    });
    console.log("LocalStorage cargado correctamente");
  } catch (error) {
    console.error("Hubo un error al leer los datos JSON:", error);
  }
};

export {
  users,
  registrationUsers,
  saveLocalStorageFile,
  loadLocalStorageFromFile,
};
