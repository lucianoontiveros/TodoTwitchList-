export const validateCommand = (message) => {
  const validCommands = new Set([
    "id?",
    "eliminarusuario",
    "cambiarusuario",
    "tarea",
    "add",
    "t",
    "task",
    "lista",
    "list",
    "v",
    "marcar",
    "check",
    "done",
    "x",
    "eliminar",
    "borrar",
    "delete",
    "modificar",
    "cambiar",
    "change",
    "clear",
    "borrartodo",
    "pickup",
    "realizadas",
    "nacimiento",
    "instagram",
    "opositopara",
    "estudiopara",
    "giveCroquetas",
    "nacionalidad",
    "datos",
    "info",
    "addexam",
    "examdelete",
    "reviewexam",
    "deleteallexam",
    "reparar", // Agregado el comando reparar
    "croquetas50",
    "dar50",
  ]);

  const command = message.slice(1).split(" ")[0].toLowerCase();

  return validCommands.has(command) ? command : null;
};
