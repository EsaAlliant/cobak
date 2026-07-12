/**
 * Mengecilkan ukuran file gambar di browser sebelum diunggah, supaya halaman publik
 * tetap ringan meski admin upload foto asli dari HP (bisa 5-10MB).
 *
 * - Hanya memproses tipe image/* (PDF & file lain dilewati apa adanya).
 * - Melebarkan sisi terpanjang maksimal `maxDimension` px, sisanya menyesuaikan proporsi.
 * - Re-encode ke JPEG kualitas `quality` untuk memangkas ukuran file.
 * - Kalau gagal (browser lama, dsb) atau hasilnya malah lebih besar, kembalikan file asli.
 */
export async function compressImage(file: File, maxDimension = 1600, quality = 0.82): Promise<File> {
  if (!file.type.startsWith("image/") || file.type === "image/svg+xml" || file.type === "image/gif") {
    return file;
  }

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);

    const blob: Blob | null = await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
    if (!blob || blob.size >= file.size) return file;

    const newName = file.name.replace(/\.[a-zA-Z0-9]+$/, "") + ".jpg";
    return new File([blob], newName, { type: "image/jpeg" });
  } catch {
    return file;
  }
}
