/**
 * Image Compressor & Optimizer Utility
 * Scales down large smartphone camera photos (e.g. 10MB - 20MB down to <200KB)
 * using client-side HTML5 Canvas before uploading to Supabase Storage.
 */

/**
 * Robust check if a file is an image, checking MIME type and common file extensions.
 * Handles smartphone camera quirks where MIME types might be empty or non-standard.
 */
export function isImageFile(file: File): boolean {
  if (!file) return false;
  if (file.type && file.type.toLowerCase().startsWith("image/")) {
    return true;
  }
  const name = file.name || "";
  return /\.(jpe?g|png|webp|gif|bmp|heic|heif|svg)$/i.test(name);
}

/**
 * Calculate proportional dimensions preserving aspect ratio within bounding box.
 */
export function calculateDimensions(
  width: number,
  height: number,
  maxWidth = 1200,
  maxHeight = 1200
): { width: number; height: number } {
  if (width <= maxWidth && height <= maxHeight) {
    return { width, height };
  }

  let newWidth = width;
  let newHeight = height;

  if (width > height) {
    if (width > maxWidth) {
      newHeight = Math.round((height * maxWidth) / width);
      newWidth = maxWidth;
    }
    if (newHeight > maxHeight) {
      newWidth = Math.round((newWidth * maxHeight) / newHeight);
      newHeight = maxHeight;
    }
  } else {
    if (height > maxHeight) {
      newWidth = Math.round((width * maxHeight) / height);
      newHeight = maxHeight;
    }
    if (newWidth > maxWidth) {
      newHeight = Math.round((newHeight * maxWidth) / newWidth);
      newWidth = maxWidth;
    }
  }

  return { width: Math.max(1, newWidth), height: Math.max(1, newHeight) };
}

/**
 * Compress an image file to a lightweight Blob (WebP or JPEG fallback).
 * Uses canvas.toBlob to avoid high memory usage of base64 strings on mobile devices.
 */
export async function compressImageToBlob(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<{ blob: Blob; mimeType: string }> {
  // If SVG, return as-is
  if (file.type === "image/svg+xml" || file.name.endsWith(".svg")) {
    return { blob: file, mimeType: "image/svg+xml" };
  }

  return new Promise((resolve) => {
    // Create object URL for memory-safe image decoding
    const objectUrl = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);
      const { width, height } = calculateDimensions(
        img.naturalWidth || img.width,
        img.naturalHeight || img.height,
        maxWidth,
        maxHeight
      );

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        // If context fails, return original file
        resolve({ blob: file, mimeType: file.type || "image/jpeg" });
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";
      ctx.drawImage(img, 0, 0, width, height);

      // Attempt WebP first for optimal compression
      canvas.toBlob(
        (webpBlob) => {
          if (webpBlob && webpBlob.size > 0) {
            resolve({ blob: webpBlob, mimeType: "image/webp" });
          } else {
            // Fallback to JPEG
            canvas.toBlob(
              (jpegBlob) => {
                if (jpegBlob && jpegBlob.size > 0) {
                  resolve({ blob: jpegBlob, mimeType: "image/jpeg" });
                } else {
                  resolve({ blob: file, mimeType: file.type || "image/jpeg" });
                }
              },
              "image/jpeg",
              quality
            );
          }
        },
        "image/webp",
        quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      // Fallback: If image cannot be decoded (e.g. HEIC on unsupported browser), return original file
      resolve({ blob: file, mimeType: file.type || "image/jpeg" });
    };

    img.src = objectUrl;
  });
}

/**
 * Compress an image file and return a new File instance ready for Supabase Storage upload.
 */
export async function compressImageToFile(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<File> {
  // If file is already small (< 150KB) and an accepted format, don't recompress
  if (file.size < 150 * 1024 && (file.type === "image/webp" || file.type === "image/jpeg")) {
    return file;
  }

  const { blob, mimeType } = await compressImageToBlob(file, maxWidth, maxHeight, quality);
  const ext = mimeType === "image/webp" ? "webp" : "jpg";
  const baseName = file.name.replace(/\.[^/.]+$/, "") || "photo";
  const cleanBaseName = baseName.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 30);
  const fileName = `${cleanBaseName}.${ext}`;

  return new File([blob], fileName, { type: mimeType, lastModified: Date.now() });
}

/**
 * Backward compatible data URL compression
 */
export async function compressImage(
  file: File,
  maxWidth = 1200,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  const { blob } = await compressImageToBlob(file, maxWidth, maxHeight, quality);
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
}
