import { supabase } from "@/lib/supabase";

/**
 * Upload an image file to Supabase Storage Bucket ('public-images')
 * Returns the permanent public CDN URL of the uploaded image.
 */
export async function uploadVillageImage(
  file: File,
  folder: "berita" | "umkm" | "perangkat" | "profil" | "dokumen" = "berita"
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not available in current environment.");
  }

  // 1. Validasi ukuran file (Maksimal 5MB)
  const MAX_SIZE = 5 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    throw new Error("Ukuran file melebihi batas maksimal (5 MB). Harap pilih file yang lebih kecil.");
  }

  // 2. Validasi tipe file / MIME type yang diizinkan
  const fileExt = (file.name.split(".").pop() || "jpg").toLowerCase();
  const cleanExt = fileExt.replace(/[^a-z0-9]/g, "");
  const allowedExtensions = ["jpg", "jpeg", "png", "webp", "pdf"];
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  if (!allowedExtensions.includes(cleanExt) || (file.type && !allowedMimeTypes.includes(file.type.toLowerCase()))) {
    throw new Error("Format file tidak didukung. Hanya file gambar (JPG, PNG, WEBP) atau PDF yang diperbolehkan.");
  }

  // Generate unique file path: folder/timestamp-random.ext
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const filePath = `${folder}/${Date.now()}-${randomSuffix}.${cleanExt}`;

  const { data, error } = await supabase.storage
    .from("public-images")
    .upload(filePath, file, {
      cacheControl: "31536000", // 1 year cache
      upsert: false,
      contentType: file.type || "image/jpeg",
    });

  if (error) {
    console.error("Supabase storage upload error:", error);
    throw new Error(`Gagal mengunggah gambar ke server: ${error.message}`);
  }

  const { data: publicUrlData } = supabase.storage
    .from("public-images")
    .getPublicUrl(data.path);

  return publicUrlData.publicUrl;
}
