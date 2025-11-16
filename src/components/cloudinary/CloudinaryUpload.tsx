/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { useState } from "react";

interface CloudinaryUploadProps {
  handlePhotoUpload: (photo: { url: string; isCover: boolean }) => void;
  handlePhotoRemove?: (url: string) => void;
  existingImages?: string[];
}

export default function CloudinaryUpload({
  handlePhotoUpload,
  handlePhotoRemove,
  existingImages = [],
}: CloudinaryUploadProps) {
  const [images, setImages] = useState<string[]>(existingImages);

  const handleSuccess = (result: any) => {
    const url = result?.info?.secure_url;
    if (!url) return;

    const updated = [...images, url];
    setImages(updated);

    handlePhotoUpload({ url, isCover: images.length === 0 });
  };

  const handleRemove = (url: string) => {
    const updated = images.filter((img) => img !== url);
    setImages(updated);
    handlePhotoRemove?.(url);
  };

  return (
    <div className="space-y-4">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
        options={{
          cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
          resourceType: "image",
          folder: "vehicles",
          sources: ["local", "camera", "google_drive"],
          theme: "minimal",
          singleUploadAutoClose: true,
          language: "es",
          multiple: false,
        }}
        onSuccess={handleSuccess}
      >
        {({ open }) => (
          <button
            type="button"
            onClick={() => open()}
            className="px-6 py-2 bg-custume-blue text-white rounded-md hover:bg-blue-700 transition"
          >
            Subir imagen
          </button>
        )}
      </CldUploadWidget>

      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div key={index} className="relative">
            <Image
              src={url}
              alt={`imagen-${index}`}
              width={160}
              height={120}
              className="rounded-md object-cover shadow"
            />
            <button
              type="button"
              onClick={() => handleRemove(url)}
              className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1 text-xs"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
