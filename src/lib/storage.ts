import { supabase } from "@/lib/supabase";
import { compressImageToFile, isImageFile } from "@/utils/imageCompressor";

/**
 * Upload an image or document file to Supabase Storage Bucket ('public-images')
 * Automatically compresses large mobile photos (e.g. 10MB-20MB down to <250KB WebP/JPEG)
 * before uploading to ensure reliable, lightning-fast uploads from smartphones and laptops.
 * Returns the permanent public CDN URL of the uploaded image.
 */
export async function uploadVillageImage(
  file: File,
  folder: "berita" | "umkm" | "perangkat" | "profil" | "dokumen" = "berita"
): Promise<string> {
  if (!supabase) {
    throw new Error("Supabase client is not available in current environment.");
  }

  let fileToUpload: File = file;

  // 1. If it's an image, auto-compress on the client first
  if (isImageFile(file)) {
    try {
      fileToUpload = await compressImageToFile(file, 1200, 1200, 0.82);
    } catch (compressErr) {
      console.warn("Client compression failed, attempting upload with original file:", compressErr);
      fileToUpload = file;
    }
  }

  // 2. Validate file size (Max 5MB for compressed image, 10MB for documents)
  const MAX_SIZE = folder === "dokumen" ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
  if (fileToUpload.size > MAX_SIZE) {
    throw new Error(
      `Ukuran file (${(fileToUpload.size / (1024 * 1024)).toFixed(1)} MB) melebihi batas maksimal. Harap pilih gambar lain.`
    );
  }

  // 3. Resolve clean extension based on MIME type or filename
  let cleanExt = "jpg";
  if (fileToUpload.type === "image/webp") {
    cleanExt = "webp";
  } else if (fileToUpload.type === "image/png") {
    cleanExt = "png";
  } else if (fileToUpload.type === "image/jpeg" || fileToUpload.type === "image/jpg") {
    cleanExt = "jpg";
  } else if (fileToUpload.type === "application/pdf") {
    cleanExt = "pdf";
  } else {
    const rawExt = fileToUpload.name.split(".").pop()?.toLowerCase() || "jpg";
    cleanExt = rawExt.replace(/[^a-z0-9]/g, "") || "jpg";
  }

  // Generate unique file path: folder/timestamp-random.ext
  const randomSuffix = Math.random().toString(36).substring(2, 9);
  const filePath = `${folder}/${Date.now()}-${randomSuffix}.${cleanExt}`;

  const { data, error } = await supabase.storage
    .from("public-images")
    .upload(filePath, fileToUpload, {
      cacheControl: "31536000", // 1 year cache
      upsert: false,
      contentType: fileToUpload.type || (cleanExt === "webp" ? "image/webp" : "image/jpeg"),
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

