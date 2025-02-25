export const handleTimer = (
  username,
  prevUser,
  timeoutRef,
  setIsInfoUserVisible,
  setCurrentUser
) => {
  if (prevUser.current === username) {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsInfoUserVisible(false);
      setCurrentUser(null);
    }, 5000); // Extiende 5 segundos
  } else {
    prevUser.current = username;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsInfoUserVisible(false);
      setCurrentUser(null);
    }, 30000); // Temporizador normal
  }
};
