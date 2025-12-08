import { useCallback } from 'react';
import { useSafeTimeout } from './useSafeTimeout';
import { handleTimer } from '../utils/handleTimer';
import { validateCommand } from '../utils/validateCommand';

export function useMessageHandler() {
  const { safeSetTimeout, safeClearTimeout } = useSafeTimeout();

  const createMessageHandler = useCallback(({
    timeoutRef,
    prevUser,
    setIsInfoUserVisible,
    setCurrentUser
  }) => {
    let isProcessing = false;
    let lastProcessedMessage = '';
    let lastProcessedUser = '';

    return (channel, tags, message, self) => {
      if (self || !message?.startsWith("!")) return;
      
      const username = tags?.username;
      if (!username) return;

      // Prevenir procesamiento duplicado
      const messageKey = `${username}-${message}-${Date.now()}`;
      if (isProcessing || 
          (lastProcessedMessage === message && lastProcessedUser === username)) {
        return;
      }

      isProcessing = true;
      lastProcessedMessage = message;
      lastProcessedUser = username;

      try {
        // Manejar el temporizador de visibilidad
        handleTimer(
          username,
          prevUser,
          timeoutRef,
          setIsInfoUserVisible,
          setCurrentUser,
          safeSetTimeout,
          safeClearTimeout
        );

        // Validar comando
        const commandVerify = validateCommand(message.toLowerCase().split(" ")[0]);
        if (!commandVerify) {
          isProcessing = false;
          return;
        }

        // Aquí puedes agregar el resto de la lógica de manejo de mensajes
        console.log(`Mensaje recibido de ${username}: ${message}`);
      } catch (error) {
        console.error('Error procesando mensaje:', error);
      } finally {
        // Resetear el flag de procesamiento después de un breve delay
        setTimeout(() => {
          isProcessing = false;
        }, 100);
      }
    };
  }, [safeSetTimeout, safeClearTimeout]);

  return {
    createMessageHandler
  };
}