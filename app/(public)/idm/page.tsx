// app/(public)/idm/page.tsx

import {
  redirect,
} from 'next/navigation';

export default function IdmPage() {
  redirect(
    '/pembangunan#status-idm'
  );
}