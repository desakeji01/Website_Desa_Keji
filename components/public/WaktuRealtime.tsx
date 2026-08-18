'use client';

import { Clock3 } from 'lucide-react';
import { useEffect, useState } from 'react';

const TIME_ZONE = 'Asia/Jakarta';

const formatterTanggal = new Intl.DateTimeFormat('id-ID', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: TIME_ZONE,
});

const formatterJam = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
  timeZone: TIME_ZONE,
});

function kapitalAwal(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function WaktuRealtime() {
  const [waktu, setWaktu] = useState<Date | null>(null);

  useEffect(() => {
    function perbaruiWaktu() {
      setWaktu(new Date());
    }

    perbaruiWaktu();

    const intervalId = window.setInterval(perbaruiWaktu, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const tanggal = waktu
    ? kapitalAwal(formatterTanggal.format(waktu))
    : 'Memuat...';

  const jam = waktu
    ? formatterJam.format(waktu).replace(/\./g, ':')
    : '--:--:--';

  return (
    <div className="absolute right-3 top-3 z-30 sm:right-5 sm:top-5 lg:right-8 lg:top-7">
      <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-black/30 px-3 py-2 text-white shadow-lg backdrop-blur-md">
        <Clock3
          size={13}
          className="shrink-0 text-emerald-300"
        />

        <div className="flex items-center gap-1.5 whitespace-nowrap">
          <time className="text-[9px] font-bold text-white/90 sm:text-[10px]">
            {tanggal}
          </time>

          <span className="h-3 w-px bg-white/25" />

          <time className="font-mono text-[9px] font-black tabular-nums tracking-wide text-white sm:text-[10px]">
            {jam}
          </time>

          <span className="text-[8px] font-extrabold uppercase tracking-wider text-emerald-300">
            WIB
          </span>
        </div>
      </div>
    </div>
  );
}