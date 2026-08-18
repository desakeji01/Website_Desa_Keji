// types/umkm.ts

export interface ProdukUmkm {
  id: string;

  nama_produk: string;
  slug: string;
  kategori: string;

  harga: number;
  satuan: string;
  deskripsi: string | null;

  nama_penjual: string;
  nomor_whatsapp: string | null;
  alamat: string | null;
  lokasi_url: string | null;

  gambar_url: string | null;

  terverifikasi: boolean;
  aktif: boolean;
  urutan: number;

  created_at: string;
  updated_at: string;
}