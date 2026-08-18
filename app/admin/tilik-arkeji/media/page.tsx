// app/admin/tilik-arkeji/media/page.tsx

import {
  redirect,
} from 'next/navigation';

export const dynamic =
  'force-dynamic';

export default function AdminMediaTilikPage() {
  redirect(
    '/admin/tilik-arkeji#daftar-struktur'
  );
}