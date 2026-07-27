import { useState } from "react";
import { useAuth } from "../authpage/Authcontext";
import "./NewArtworkUpload.css";

const API_URL = import.meta.env.VITE_API_URL;

interface PendingImage {
  file: File;
  previewUrl: string;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

export default function ArtworkUpload() {
  const { authFetch } = useAuth();

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState<PendingImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleFilesSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    const newImages = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
    e.target.value = "";
  }

  function removeImage(index: number) {
    setImages((prev) => {
      URL.revokeObjectURL(prev[index].previewUrl);
      return prev.filter((_, i) => i !== index);
    });
  }

  function moveToFirst(index: number) {
    setImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
  }

  async function uploadOneImage(file: File, publicId: string): Promise<string> {
    const sigRes = await authFetch(`${API_URL}/api/admin/upload-signature`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });

    if (!sigRes.ok) throw new Error("Nu am putut obține semnătura de upload");
    const { signature, timestamp, folder, cloudName, apiKey } = await sigRes.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("api_key", apiKey);
    formData.append("timestamp", String(timestamp));
    formData.append("signature", signature);
    formData.append("folder", folder);
    formData.append("public_id", publicId);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    if (!uploadRes.ok) throw new Error(`Upload eșuat pentru ${publicId}`);
    const data = await uploadRes.json();
    return data.secure_url as string;
  }

  async function handleSubmit() {
    setError(null);

    if (!name.trim()) {
      setError("Numele operei este obligatoriu");
      return;
    }
    if (!price.trim() || isNaN(Number(price)) || Number(price) <= 0) {
      setError("Prețul este obligatoriu și trebuie să fie un număr valid");
      return;
    }
    if (images.length === 0) {
      setError("Adaugă cel puțin o imagine");
      return;
    }

    setUploading(true);
    try {
      const baseSlug = slugify(name);
      alert(images.length)
      const uploadedUrls: string[] = [];
      for (let i = 0; i < images.length; i++) {
        const publicId = `${baseSlug}_${i + 1}`;
        const url = await uploadOneImage(images[i].file, publicId);
        uploadedUrls.push(url);
      }

      const createRes = await authFetch(`${API_URL}/api/admin/artworks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, price: Number(price), photoUrls: uploadedUrls }),
      });

      if (!createRes.ok) throw new Error("Nu am putut salva opera");

      setSuccess(true);
      setName("");
      setPrice("");
      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));
      setImages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Eroare la încărcare");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="new-artwork">
      <h2 className="new-artwork__title">Adaugă operă nouă</h2>

      <label className="new-artwork__field">
        <span>Nume operă</span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='ex: "Lumini de toamnă"'
        />
      </label>

      <label className="new-artwork__field">
        <span>Preț (lei)</span>
        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="ex: 1200"
        />
      </label>

      {name && (
        <p className="new-artwork__slug-preview">
          Fișierele vor fi denumite: <code>{slugify(name)}_1</code>,{" "}
          <code>{slugify(name)}_2</code>, ...
        </p>
      )}

      <label className="new-artwork__upload-btn">
        Alege imagini
        <input type="file" accept="image/*" multiple onChange={handleFilesSelected} hidden />
      </label>

      {images.length > 0 && (
        <div className="new-artwork__grid">
          {images.map((img, index) => (
            <div key={img.previewUrl} className="new-artwork__thumb">
              <img src={img.previewUrl} alt={`Imagine ${index + 1}`} />
              {index === 0 && <span className="new-artwork__preview-badge">Preview</span>}

              <div className="new-artwork__thumb-actions">
                {index !== 0 && (
                  <button type="button" onClick={() => moveToFirst(index)}>
                    Fă preview
                  </button>
                )}
                <button type="button" onClick={() => removeImage(index)}>
                  Șterge
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && <p className="new-artwork__error">{error}</p>}
      {success && <p className="new-artwork__success">Operă adăugată cu succes.</p>}

      <button
        className="new-artwork__submit"
        onClick={handleSubmit}
        disabled={uploading}
      >
        {uploading ? "Se încarcă..." : "Salvează opera"}
      </button>
    </div>
  );
}