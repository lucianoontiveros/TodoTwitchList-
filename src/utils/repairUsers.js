import { Viewer } from "../data/constructores";
import { users, registrationUsers } from "../data/LocalStorage/controllerLocalStorage";

/**
 * Repara usuarios que puedan tener una estructura incorrecta
 * @returns {Object} Objeto con información sobre la reparación
 * @property {boolean} repaired - Indica si se reparó al menos un usuario
 * @property {number} count - Número de usuarios reparados
 * @property {string[]} users - Nombres de usuario de los usuarios reparados
 */
export const repairBrokenUsers = () => {
  const brokenUsers = [];
  let errorCount = 0;
  
  console.log(`Iniciando reparación de usuarios. Total de usuarios: ${Object.keys(users).length}`);
  
  Object.keys(users).forEach(username => {
    try {
      const user = users[username];
      let needsRepair = false;
      
      // Verificar si el usuario necesita reparación
      if (!user || typeof user !== 'object' || !user._id || !user.name || !user.tag || !user.registerUser) {
        needsRepair = true;
        console.log(`Usuario necesita reparación: ${username}`, user);
        
        try {
          // Crear un nuevo usuario con la estructura correcta
          const newUser = new Viewer(username);
          
          // Si el usuario existía, preservar sus datos
          if (user && typeof user === 'object') {
            // Preservar datos existentes excepto _id y name
            Object.keys(user).forEach(key => {
              if (key !== '_id' && key !== 'name') {
                try {
                  newUser[key] = user[key];
                } catch (e) {
                  console.warn(`No se pudo copiar la propiedad ${key} del usuario ${username}:`, e);
                }
              }
            });
          }
          
          // Asegurar propiedades requeridas
          if (!newUser._id || typeof newUser.registerID === 'function') {
            try {
              newUser.registerID();
            } catch (e) {
              console.error(`Error al generar ID para ${username}:`, e);
              // Generar un ID manualmente si falla
              newUser._id = `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
            }
          }
          
          if (!newUser.tag) newUser.tag = 'viewer';
          
          // Asegurar que el método registerUser exista
          if (typeof newUser.registerUser !== 'function') {
            console.log(`Añadiendo método registerUser a ${username}`);
            newUser.registerUser = function() {
              const date = new Date();
              this.lastTime = date;
              this.mensaje = `${this.name} interactuó por última vez: ${date.toLocaleString('es-ES')}`;
            };
          }
          
          // Llamar a registerUser
          try {
            newUser.registerUser();
          } catch (e) {
            console.error(`Error al ejecutar registerUser para ${username}:`, e);
            // Continuar a pesar del error
          }
          
          // Reemplazar el usuario roto con el reparado
          users[username] = newUser;
          brokenUsers.push(username);
          console.log(`Usuario reparado: ${username}`);
          
        } catch (error) {
          errorCount++;
          console.error(`Error crítico reparando usuario ${username}:`, error);
        }
      }
    } catch (error) {
      errorCount++;
      console.error(`Error procesando usuario ${username}:`, error);
    }
  });
  
  // Guardar los cambios si hubo reparaciones
  if (brokenUsers.length > 0) {
    registrationUsers(users);
    console.log(`Se repararon ${brokenUsers.length} usuarios:`, brokenUsers);
    return { 
      repaired: true, 
      count: brokenUsers.length, 
      users: brokenUsers,
      errorCount
    };
  }
  
  console.log('No se encontraron usuarios que requieran reparación');
  return { repaired: false, count: 0, users: [] };
};

// Ejecutar la reparación automáticamente al importar
// Esto se puede comentar si solo se quiere ejecutar manualmente
// repairBrokenUsers();
