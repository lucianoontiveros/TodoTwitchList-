import { saveAs } from "file-saver";

// Obtener usuarios desde localStorage
const users = JSON.parse(localStorage.getItem("users")) || {};

// Registrar usuarios en localStorage y notificar cambios
const registrationUsers = (updatedUsers) => {
  localStorage.setItem("users", JSON.stringify(updatedUsers));
  window.dispatchEvent(new Event("usersUpdated")); // 🔹 Notificar actualización
};

// Guardar localStorage en un archivo
const saveLocalStorageFile = () => {
  const localStorageData = JSON.stringify(localStorage, null, 2);
  const blob = new Blob([localStorageData], { type: "text/plain" });
  saveAs(blob, "localStorage.txt");
};

// Cargar datos desde un archivo a localStorage
const loadLocalStorageFromFile = (jsonData) => {
  try {
    Object.keys(jsonData).forEach((key) => {
      localStorage.setItem(key, jsonData[key]);
    });
    window.dispatchEvent(new Event("usersUpdated")); // 🔹 Notificar actualización
  } catch (error) {
    console.error('Error loading localStorage:', error);
  }
};

export {
  users,
  registrationUsers,
  saveLocalStorageFile,
  loadLocalStorageFromFile,
};
