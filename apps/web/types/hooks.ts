// src/types/hooks.ts

export interface UseFetchOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    headers?: Record<string, string>;
  }
  
  export interface FetchResponse<T> {
    data: T | null;
    error: string | null;
  }
  