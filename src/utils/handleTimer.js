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
    }, 3000); // Extiende 5 segundos
  } else {
    prevUser.current = username;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setIsInfoUserVisible(false);
      setCurrentUser(null);
    }, 50000); // Temporizador normal
  }
};
