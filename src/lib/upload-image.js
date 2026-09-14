// Unsigned Cloudinary upload, used by the admin dish form.
// Needs NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
// in .env.local, and the preset's Signing Mode set to "Unsigned".
export async function uploadImage(file) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  // NEXT_PUBLIC_* values are inlined at build time, so a missing one here
  // usually means .env.local changed without restarting the dev server.
  const missing = [
    !cloudName && "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
    !uploadPreset && "NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET",
  ].filter(Boolean);

  if (missing.length > 0) {
    throw new Error(
      `Cloudinary is not configured: ${missing.join(" and ")} is empty. ` +
        "Set it in poca-web/.env.local, then restart npm run dev.",
    );
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  let response;
  try {
    response = await fetch(url, { method: "POST", body: formData });
  } catch (err) {
    throw new Error(`Could not reach Cloudinary: ${err.message}`);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Cloudinary explains the real problem in error.message — a signed preset,
    // an unknown cloud name, a file over the plan limit — so surface it.
    const reason = data?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`Cloudinary rejected the upload: ${reason}`);
  }

  if (!data?.secure_url) {
    throw new Error("Cloudinary returned no image URL");
  }

  return data.secure_url;
}
