// hooks/useBerandaPublic.ts

'use client';

import {
  useEffect,
  useState,
} from 'react';

import {
  BERANDA_DEFAULTS,
} from '@/lib/beranda-defaults';

import type {
  BerandaPublicData,
} from '@/types/beranda';

interface BerandaApiResponse {
  data?:
    | Partial<BerandaPublicData>
    | null;

  message?: string;
}

export function useBerandaPublic() {
  const [
    data,
    setData,
  ] = useState<
    BerandaPublicData
  >(BERANDA_DEFAULTS);

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<
    string | null
  >(null);

  useEffect(() => {
    const controller =
      new AbortController();

    let mounted = true;

    async function loadBeranda() {
      try {
        setIsLoading(true);
        setErrorMessage(null);

        const response =
          await fetch(
            '/api/beranda',
            {
              method: 'GET',
              cache: 'no-store',
              signal:
                controller.signal,

              headers: {
                Accept:
                  'application/json',
              },
            }
          );

        const result =
          (await response.json()) as
            BerandaApiResponse;

        if (!response.ok) {
          throw new Error(
            result.message ??
              'Data beranda gagal dimuat.'
          );
        }

        if (
          mounted &&
          result.data
        ) {
          setData({
            ...BERANDA_DEFAULTS,
            ...result.data,
          });
        }
      } catch (error) {
        if (
          error instanceof Error &&
          error.name ===
            'AbortError'
        ) {
          return;
        }

        console.error(
          'Gagal mengambil data beranda:',
          error
        );

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Data beranda gagal dimuat.'
          );
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    loadBeranda();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);

  return {
    data,
    isLoading,
    errorMessage,
  };
}