import { server } from "@/app/api/api";

// Signed Cloudinary upload, used by the admin dish and category forms.
// The API (logged-in admins only) signs each upload with the Cloudinary
// secret, which never reaches the browser — so there is no public preset
// that lets anyone upload to the account.
export async function uploadImage(file) {
  let sign;
  try {
    ({ data: sign } = await server.post("/upload/sign"));
  } catch (err) {
    const reason = err.response?.data?.message ?? err.message;
    throw new Error(`Could not authorise the upload: ${reason}`);
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", sign.apiKey);
  formData.append("timestamp", String(sign.timestamp));
  formData.append("folder", sign.folder);
  formData.append("signature", sign.signature);

  let response;
  try {
    response = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });
  } catch (err) {
    throw new Error(`Could not reach Cloudinary: ${err.message}`);
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // Cloudinary explains the real problem in error.message — a bad
    // signature, a file over the plan limit — so surface it.
    const reason = data?.error?.message ?? `HTTP ${response.status}`;
    throw new Error(`Cloudinary rejected the upload: ${reason}`);
  }

  if (!data?.secure_url) {
    throw new Error("Cloudinary returned no image URL");
  }

  return data.secure_url;
}
