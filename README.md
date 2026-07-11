# CMS Desa Glagaharum

Portal informasi publik dan CMS Desa Glagaharum berbasis Next.js, TypeScript, dan Supabase.

## Menjalankan aplikasi

1. Salin nilai Supabase baru ke `.env.local`.
2. Jalankan `supabase/schema.sql` melalui SQL Editor Supabase.
3. Buat pengguna Admin pertama pada Supabase Auth, lalu tambahkan barisnya ke tabel `users`.
4. Jalankan `npm run dev`.

Bucket Storage yang diperlukan: `website`, `gallery`, `news`, `umkm`, dan `branding`.
