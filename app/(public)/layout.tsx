// app/(public)/layout.tsx
import Navbar from '@/components/layouts/Navbar';
import Footer from '@/components/layouts/Footer';
import SplashScreen from '@/components/SplashScreen'; // 1. Panggil Splash Screen

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* 2. Pasang Splash Screen di sini (paling atas) */}
      <SplashScreen />

      <Navbar />
      
      {/* Konten Utama akan mengisi area kosong di tengah */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
}