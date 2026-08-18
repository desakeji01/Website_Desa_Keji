// types/pertanahan.ts

/* =========================================================
   SETTINGS
========================================================= */

export interface PertanahanSettings {
  setting_key:
    string;

  judul:
    string;

  deskripsi:
    string;

  tahun_data:
    number | null;

  sumber_data:
    string | null;

  catatan:
    string | null;

  peta_url:
    string | null;

  aktif:
    boolean;

  created_at?:
    string;

  updated_at:
    string;
}

/* =========================================================
   DATA LAMA

   Tetap dipertahankan supaya file lama yang mungkin masih
   memakai interface ini tidak langsung error.
========================================================= */

export interface PertanahanData {
  id:
    string;

  nama:
    string;

  kategori:
    string;

  luas_hektar:
    number;

  jumlah_bidang:
    number | null;

  keterangan:
    string | null;

  warna:
    string;

  aktif:
    boolean;

  urutan:
    number;

  created_at:
    string;

  updated_at:
    string;
}

/* =========================================================
   ALBUM
========================================================= */

export interface PertanahanAlbum {
  id:
    string;

  judul:
    string;

  slug:
    string;

  deskripsi:
    string | null;

  tahun:
    number | null;

  aktif:
    boolean;

  urutan:
    number;

  created_at:
    string;

  updated_at:
    string;
}

/* =========================================================
   FOTO
========================================================= */

export interface PertanahanFoto {
  id:
    string;

  album_id:
    string;

  foto_url:
    string;

  foto_path:
    string;

  caption:
    string | null;

  urutan:
    number;

  aktif:
    boolean;

  created_at:
    string;

  updated_at:
    string;
}

/* =========================================================
   ALBUM + FOTO
========================================================= */

export interface PertanahanAlbumWithFotos
  extends PertanahanAlbum {
  fotos:
    PertanahanFoto[];
}