// components/admin/NotifikasiPermohonan.tsx

'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import Link from 'next/link';

import {
  Bell,
  BellRing,
  CheckCheck,
  Clock3,
  ExternalLink,
  FileText,
  LoaderCircle,
  MessageCircle,
  ShieldCheck,
  X,
} from 'lucide-react';

import {
  useRouter,
} from 'next/navigation';

interface NotifikasiItem {
  id: number;
  namaPemohon: string;
  nikLast4: string;
  layanan: string;
  noWa: string;
  status: string;
  createdAt: string;
}

interface ApiResponse {
  success: boolean;
  latestId: number;
  unreadCount: number;
  totalMenunggu: number;
  items: NotifikasiItem[];
  message?: string;
}

const STORAGE_SEEN_ID =
  'admin-permohonan-seen-id';

const STORAGE_KNOWN_ID =
  'admin-permohonan-known-id';

const POLLING_INTERVAL =
  10_000;

function formatTanggal(
  value: string
) {
  const date =
    new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return '-';
  }

  return new Intl.DateTimeFormat(
    'id-ID',
    {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
      timeZone:
        'Asia/Jakarta',
    }
  ).format(date);
}

function formatNomorWhatsApp(
  value: string
) {
  const digits =
    value.replace(/\D/g, '');

  if (
    digits.startsWith('0')
  ) {
    return `62${digits.slice(
      1
    )}`;
  }

  if (
    digits.startsWith('8')
  ) {
    return `62${digits}`;
  }

  return digits;
}

function getStorageNumber(
  key: string
) {
  const value =
    window.localStorage.getItem(
      key
    );

  if (!value) {
    return null;
  }

  const parsed =
    Number(value);

  if (
    !Number.isInteger(
      parsed
    ) ||
    parsed < 0
  ) {
    return null;
  }

  return parsed;
}

export default function NotifikasiPermohonan() {
  const router =
    useRouter();

  const containerRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const initializedRef =
    useRef(false);

  const seenIdRef =
    useRef(0);

  const knownIdRef =
    useRef(0);

  const latestIdRef =
    useRef(0);

  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    items,
    setItems,
  ] = useState<
    NotifikasiItem[]
  >([]);

  const [
    unreadCount,
    setUnreadCount,
  ] = useState(0);

  const [
    totalMenunggu,
    setTotalMenunggu,
  ] = useState(0);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const [
    toastItem,
    setToastItem,
  ] = useState<
    NotifikasiItem | null
  >(null);

  const [
    notificationPermission,
    setNotificationPermission,
  ] = useState<
    NotificationPermission | 'unsupported'
  >('default');

  const tampilkanNotifikasiDesktop =
    useCallback(
      (
        item:
          NotifikasiItem
      ) => {
        if (
          typeof window ===
            'undefined' ||
          !(
            'Notification' in
            window
          ) ||
          Notification.permission !==
            'granted'
        ) {
          return;
        }

        const notification =
          new Notification(
            'Permohonan Layanan Baru',
            {
              body:
                `${item.namaPemohon} mengajukan ${item.layanan}.`,

              icon:
                '/logodesakeji.png',

              tag:
                `permohonan-${item.id}`,
            }
          );

        notification.onclick =
          () => {
            window.focus();

            router.push(
              '/admin/permohonan'
            );

            notification.close();
          };
      },
      [
        router,
      ]
    );

  const ambilNotifikasi =
    useCallback(
      async () => {
        try {
          const response =
            await fetch(
              `/api/admin/notifikasi-permohonan?seenId=${seenIdRef.current}`,
              {
                method: 'GET',
                cache: 'no-store',
              }
            );

          const result =
            (await response.json()) as ApiResponse;

          if (
            !response.ok ||
            !result.success
          ) {
            throw new Error(
              result.message ??
                'Notifikasi tidak dapat dimuat.'
            );
          }

          const latestId =
            Number(
              result.latestId ??
                0
            );

          latestIdRef.current =
            latestId;

          setItems(
            result.items ?? []
          );

          setTotalMenunggu(
            result.totalMenunggu ??
              0
          );

          setErrorMessage('');

          /*
           * Pertama kali fitur dipasang,
           * data lama tidak langsung
           * dianggap notifikasi baru.
           */
          if (
            !initializedRef.current
          ) {
            const storedSeenId =
              getStorageNumber(
                STORAGE_SEEN_ID
              );

            const storedKnownId =
              getStorageNumber(
                STORAGE_KNOWN_ID
              );

            if (
              storedSeenId ===
              null
            ) {
              seenIdRef.current =
                latestId;

              window.localStorage.setItem(
                STORAGE_SEEN_ID,
                String(
                  latestId
                )
              );

              setUnreadCount(
                0
              );
            } else {
              seenIdRef.current =
                storedSeenId;

              setUnreadCount(
                result.unreadCount ??
                  0
              );
            }

            if (
              storedKnownId ===
              null
            ) {
              knownIdRef.current =
                latestId;

              window.localStorage.setItem(
                STORAGE_KNOWN_ID,
                String(
                  latestId
                )
              );
            } else {
              knownIdRef.current =
                storedKnownId;
            }

            initializedRef.current =
              true;

            setLoading(false);

            return;
          }

          const permohonanBaru =
            (
              result.items ??
              []
            )
              .filter(
                (item) =>
                  item.id >
                  knownIdRef.current
              )
              .sort(
                (a, b) =>
                  a.id - b.id
              );

          if (
            permohonanBaru.length >
            0
          ) {
            const terbaru =
              permohonanBaru[
                permohonanBaru.length -
                  1
              ];

            setToastItem(
              terbaru
            );

            tampilkanNotifikasiDesktop(
              terbaru
            );

            /*
             * Perbarui Server Components:
             * - dashboard admin
             * - halaman permohonan
             */
            router.refresh();

            window.setTimeout(
              () => {
                setToastItem(
                  null
                );
              },
              7000
            );
          }

          if (
            latestId >
            knownIdRef.current
          ) {
            knownIdRef.current =
              latestId;

            window.localStorage.setItem(
              STORAGE_KNOWN_ID,
              String(
                latestId
              )
            );
          }

          setUnreadCount(
            result.unreadCount ??
              0
          );
        } catch (error) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : 'Notifikasi tidak dapat dimuat.'
          );
        } finally {
          setLoading(false);
        }
      },
      [
        router,
        tampilkanNotifikasiDesktop,
      ]
    );

  function tandaiSemuaDibaca() {
    const latestId =
      latestIdRef.current;

    seenIdRef.current =
      latestId;

    window.localStorage.setItem(
      STORAGE_SEEN_ID,
      String(latestId)
    );

    setUnreadCount(0);
  }

  function toggleDropdown() {
    setOpen(
      (current) => {
        const next =
          !current;

        if (next) {
          tandaiSemuaDibaca();
        }

        return next;
      }
    );
  }

  async function aktifkanNotifikasiDesktop() {
    if (
      !(
        'Notification' in
        window
      )
    ) {
      setNotificationPermission(
        'unsupported'
      );

      return;
    }

    const permission =
      await Notification.requestPermission();

    setNotificationPermission(
      permission
    );
  }

  useEffect(() => {
    if (
      'Notification' in
      window
    ) {
      setNotificationPermission(
        Notification.permission
      );
    } else {
      setNotificationPermission(
        'unsupported'
      );
    }

    const storedSeenId =
      getStorageNumber(
        STORAGE_SEEN_ID
      );

    const storedKnownId =
      getStorageNumber(
        STORAGE_KNOWN_ID
      );

    seenIdRef.current =
      storedSeenId ?? 0;

    knownIdRef.current =
      storedKnownId ?? 0;

    void ambilNotifikasi();

    const intervalId =
      window.setInterval(
        () => {
          void ambilNotifikasi();
        },
        POLLING_INTERVAL
      );

    function handleVisibilityChange() {
      if (
        document.visibilityState ===
        'visible'
      ) {
        void ambilNotifikasi();
      }
    }

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange
    );

    return () => {
      window.clearInterval(
        intervalId
      );

      document.removeEventListener(
        'visibilitychange',
        handleVisibilityChange
      );
    };
  }, [
    ambilNotifikasi,
  ]);

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      'mousedown',
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        'mousedown',
        handleClickOutside
      );
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        className="relative shrink-0"
      >
        <button
          type="button"
          aria-label="Buka notifikasi permohonan"
          onClick={
            toggleDropdown
          }
          className={`relative flex h-11 w-11 items-center justify-center rounded-xl border shadow-sm transition ${
            open
              ? 'border-emerald-300 bg-emerald-700 text-white'
              : 'border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700'
          }`}
        >
          {unreadCount > 0 ? (
            <BellRing
              size={20}
              className="animate-pulse"
            />
          ) : (
            <Bell
              size={20}
            />
          )}

          {unreadCount > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex min-h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-black text-white shadow-md">
              {unreadCount >
              99
                ? '99+'
                : unreadCount}
            </span>
          )}
        </button>

        {open && (
          <div className="absolute right-0 top-[calc(100%+12px)] z-[70] w-[min(390px,calc(100vw-24px))] overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-950/20">
            {/* Header dropdown */}
            <div className="border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-emerald-700">
                    Administrasi Warga
                  </p>

                  <h2 className="mt-1 text-lg font-black text-slate-900">
                    Notifikasi Permohonan
                  </h2>

                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {totalMenunggu}{' '}
                    permohonan menunggu
                    diproses
                  </p>
                </div>

                <button
                  type="button"
                  aria-label="Tutup notifikasi"
                  onClick={() =>
                    setOpen(
                      false
                    )
                  }
                  className="rounded-xl p-2 text-slate-400 transition hover:bg-white hover:text-slate-700"
                >
                  <X
                    size={18}
                  />
                </button>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={
                    tandaiSemuaDibaca
                  }
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-white px-3 py-2 text-[10px] font-extrabold text-emerald-700 transition hover:bg-emerald-50"
                >
                  <CheckCheck
                    size={14}
                  />

                  Tandai dibaca
                </button>

                {notificationPermission ===
                  'default' && (
                  <button
                    type="button"
                    onClick={
                      aktifkanNotifikasiDesktop
                    }
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-3 py-2 text-[10px] font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <BellRing
                      size={14}
                    />

                    Aktifkan desktop
                  </button>
                )}

                {notificationPermission ===
                  'granted' && (
                  <span className="inline-flex items-center gap-2 rounded-xl bg-emerald-100 px-3 py-2 text-[10px] font-extrabold text-emerald-700">
                    <ShieldCheck
                      size={14}
                    />

                    Desktop aktif
                  </span>
                )}
              </div>
            </div>

            {/* Daftar notifikasi */}
            <div className="max-h-[430px] overflow-y-auto">
              {loading ? (
                <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center">
                  <LoaderCircle
                    size={28}
                    className="animate-spin text-emerald-600"
                  />

                  <p className="mt-4 text-sm font-semibold text-slate-500">
                    Memuat notifikasi...
                  </p>
                </div>
              ) : errorMessage ? (
                <div className="p-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
                    <FileText
                      size={22}
                    />
                  </div>

                  <p className="mt-4 text-sm font-bold text-red-700">
                    {errorMessage}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      void ambilNotifikasi()
                    }
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-slate-800 px-4 py-2 text-xs font-extrabold text-white"
                  >
                    Muat ulang
                  </button>
                </div>
              ) : items.length ===
                0 ? (
                <div className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                    <Bell
                      size={25}
                    />
                  </div>

                  <h3 className="mt-4 font-black text-slate-800">
                    Belum ada permohonan
                  </h3>

                  <p className="mt-2 text-xs font-medium leading-5 text-slate-500">
                    Permohonan baru akan
                    muncul otomatis pada
                    bagian ini.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100">
                  {items.map(
                    (item) => (
                      <NotifikasiItemCard
                        key={
                          item.id
                        }
                        item={
                          item
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>

            {/* Footer dropdown */}
            <div className="border-t border-slate-100 bg-slate-50 p-3">
              <Link
                href="/admin/permohonan"
                onClick={() =>
                  setOpen(
                    false
                  )
                }
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 text-xs font-extrabold text-white transition hover:bg-emerald-800"
              >
                Kelola Semua Permohonan

                <ExternalLink
                  size={15}
                />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Toast permohonan baru */}
      {toastItem && (
        <div className="fixed right-4 top-24 z-[90] w-[min(390px,calc(100vw-32px))] overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-2xl shadow-slate-950/25">
          <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-600 to-emerald-800" />

          <div className="p-5">
            <div className="flex items-start gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                <BellRing
                  size={21}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[9px] font-extrabold uppercase tracking-[0.15em] text-emerald-700">
                      Permohonan Baru
                    </p>

                    <h3 className="mt-1 font-black text-slate-900">
                      {
                        toastItem.namaPemohon
                      }
                    </h3>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setToastItem(
                        null
                      )
                    }
                    className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                  >
                    <X
                      size={16}
                    />
                  </button>
                </div>

                <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">
                  Mengajukan{' '}
                  <span className="text-emerald-700">
                    {
                      toastItem.layanan
                    }
                  </span>
                </p>

                <Link
                  href="/admin/permohonan"
                  onClick={() =>
                    setToastItem(
                      null
                    )
                  }
                  className="mt-4 inline-flex items-center gap-2 text-xs font-extrabold text-emerald-700"
                >
                  Lihat permohonan

                  <ExternalLink
                    size={14}
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function NotifikasiItemCard({
  item,
}: {
  item: NotifikasiItem;
}) {
  const whatsapp =
    formatNomorWhatsApp(
      item.noWa
    );

  const message =
    encodeURIComponent(
      `Halo ${item.namaPemohon}, permohonan layanan ${item.layanan} Anda sedang kami tindak lanjuti oleh Pemerintah Desa Keji.`
    );

  const isMenunggu =
    item.status
      .toLowerCase() ===
    'menunggu';

  return (
    <article className="group p-4 transition hover:bg-emerald-50/50">
      <div className="flex items-start gap-3">
        <div
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
            isMenunggu
              ? 'bg-amber-100 text-amber-700'
              : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {isMenunggu ? (
            <Clock3
              size={18}
            />
          ) : (
            <FileText
              size={18}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate text-sm font-black text-slate-800">
                {item.namaPemohon}
              </h3>

              <p className="mt-1 line-clamp-2 text-xs font-semibold leading-5 text-emerald-700">
                {item.layanan}
              </p>
            </div>

            <span className="shrink-0 text-[9px] font-semibold text-slate-400">
              {formatTanggal(
                item.createdAt
              )}
            </span>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-slate-100 px-2 py-1 text-[9px] font-extrabold text-slate-500">
              NIK ••••{' '}
              {item.nikLast4}
            </span>

            <span
              className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${
                isMenunggu
                  ? 'bg-amber-100 text-amber-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {item.status}
            </span>
          </div>

          <div className="mt-3 flex gap-2">
            <Link
              href="/admin/permohonan"
              className="inline-flex h-8 items-center justify-center rounded-lg bg-emerald-700 px-3 text-[10px] font-extrabold text-white"
            >
              Buka
            </Link>

            <a
              href={`https://wa.me/${whatsapp}?text=${message}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-emerald-200 bg-white px-3 text-[10px] font-extrabold text-emerald-700"
            >
              <MessageCircle
                size={13}
              />

              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}