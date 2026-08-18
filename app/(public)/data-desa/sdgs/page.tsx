// app/(public)/data-desa/sdgs/page.tsx

import {
  redirect,
} from 'next/navigation';

export default function SdgsDesaPage() {
  redirect(
    '/pembangunan#sdgs-desa'
  );
}