import { ApiError } from '@api/types';
import { AxiosError } from 'axios';
import { useCallback, useState } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: ApiError | null;
}

interface UseApiReturn<T, P extends any[]> extends UseApiState<T> {
  execute: (...params: P) => Promise<T | null>;
  reset: () => void;
}

export function useApi<T = any, P extends any[] = any[]>(
  apiFunc: (...args: P) => Promise<T>
): UseApiReturn<T, P> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(
    async (...params: P): Promise<T | null> => {
      setState({ data: null, loading: true, error: null });

      try {
        const result = await apiFunc(...params);
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (err) {
        const error = handleApiError(err);
        setState({ data: null, loading: false, error });
        return null;
      }
    },
    [apiFunc]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return {
    ...state,
    execute,
    reset,
  };
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AxiosError) {
    const response = error.response;
    
    return {
      message: response?.data?.message || error.message || 'An error occurred',
      errors: response?.data?.errors,
      status: response?.status,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
    };
  }

  return {
    message: 'An unknown error occurred',
  };
}

export default useApi;
