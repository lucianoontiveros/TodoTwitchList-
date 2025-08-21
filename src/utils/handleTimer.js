export const handleTimer = (
  username,
  prevUser,
  timeoutRef,
  setIsInfoUserVisible,
  setCurrentUser
) => {
  // Actualizar el usuario actual
  prevUser.current = username;
  
  // Limpiar cualquier temporizador existente
  clearTimeout(timeoutRef.current);
  
  // Configurar el temporizador para ocultar la interfaz después de 10 segundos
  timeoutRef.current = setTimeout(() => {
    setIsInfoUserVisible(false);
    setCurrentUser(null);
  }, 10000); // Siempre 10 segundos para cualquier interacción
};
