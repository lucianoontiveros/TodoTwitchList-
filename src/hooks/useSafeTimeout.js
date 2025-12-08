import { useCallback, useEffect, useRef } from 'react';

export function useSafeTimeout() {
  const timeoutIds = useRef(new Set());
  const isMounted = useRef(true);

  // Limpiar todos los timeouts al desmontar
  useEffect(() => {
    return () => {
      isMounted.current = false;
      timeoutIds.current.forEach((timeoutId) => clearTimeout(timeoutId));
      timeoutIds.current.clear();
    };
  }, []);

  const safeSetTimeout = useCallback((callback, delay) => {
    if (!isMounted.current) return null;
    
    const id = setTimeout(() => {
      timeoutIds.current.delete(id);
      if (isMounted.current) {
        callback();
      }
    }, delay);
    
    timeoutIds.current.add(id);
    return id;
  }, []);

  const safeClearTimeout = useCallback((id) => {
    if (id) {
      clearTimeout(id);
      timeoutIds.current.delete(id);
    }
  }, []);

  return { safeSetTimeout, safeClearTimeout };
}
