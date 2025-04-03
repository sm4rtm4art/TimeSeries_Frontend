/**
 * Hook to ensure code only runs on the client-side
 * This prevents SSR errors when accessing browser-specific APIs
 */

import { useEffect, useState } from 'react';

export function useClientOnly<T>(callback: () => T, initialValue: T): T {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    // This will only run on the client
    setValue(callback());
  }, [callback]);

  return value;
}

export function useIsMounted(): boolean {
  return useClientOnly(() => true, false);
}

export default useClientOnly; 