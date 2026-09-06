// Convierte un texto como "12; 34 ; 56;" en un array ["12", "34", "56"].
// Se usa para los comandos que aceptan varios IDs separados por ";"
// (!marcar / !check y !eliminar / !delete).
export const parseIds = (text) => {
  return text
    .trim()
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
};
