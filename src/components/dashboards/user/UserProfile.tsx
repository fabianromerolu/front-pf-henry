// src/components/dashboards/user/UserProfile.tsx
"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";

import { meApi, type UserProfile } from "@/services/userRenter.service";
import DarkButton from "@/components/Buttoms/DarkButtom";

type SexType = "male" | "female" | "other" | "undisclosed";

type ProfileForm = {
  name: string;
  username: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  biography: string;
  sex: SexType;
  birthDate: string;
};

type ProfilePatch = Partial<{
  name: string;
  username: string;
  city: string;
  state: string;
  country: string;
  address: string;
  phone: string;
  biography: string;
  sex: SexType;
  birthDate: string | null;
}>;

const fieldsBase =
  "w-full rounded-xl border px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-light-blue";

const schema = Yup.object({
  name: Yup.string().max(50),
  username: Yup.string().max(50),
  city: Yup.string().max(80),
  state: Yup.string().max(80),
  country: Yup.string().max(80),
  address: Yup.string().max(120),
  phone: Yup.string().max(20),
  biography: Yup.string().max(150),
  sex: Yup.mixed<SexType>().oneOf([
    "male",
    "female",
    "other",
    "undisclosed",
  ]),
  birthDate: Yup.string().nullable(),
});

function resolveAvatarSrc(profile?: UserProfile | null): string | null {
  const p = profile?.profilePicture;
  if (!p) return null;

  // Caso viejo: ya es una URL completa
  if (p.startsWith("http://") || p.startsWith("https://")) {
    return p;
  }

  // Caso nuevo / legacy: public_id de Cloudinary
  const cloud = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? "";
  if (!cloud) return null;

  return `https://res.cloudinary.com/${cloud}/image/upload/${p}.jpg`;
}

export default function UserProfile() {
  const [loading, setLoading] = useState(true);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const formik = useFormik<ProfileForm>({
    initialValues: {
      name: "",
      username: "",
      city: "",
      state: "",
      country: "",
      address: "",
      phone: "",
      biography: "",
      sex: "undisclosed",
      birthDate: "",
    },
    validationSchema: schema,
    onSubmit: async (values) => {
      try {
        const patch: ProfilePatch = {
          ...values,
          birthDate: values.birthDate
            ? new Date(values.birthDate).toISOString()
            : null,
        };
        const res = await meApi.updateMe(patch);
        setProfile(res);
        toast.success("Perfil actualizado");
      } catch {
        toast.error("Error al actualizar");
      }
    },
  });

  useEffect(() => {
    (async () => {
      try {
        const me = await meApi.getMe();
        setProfile(me);
        formik.setValues({
          name: me?.name ?? "",
          username: me?.username ?? "",
          city: me?.city ?? "",
          state: me?.state ?? "",
          country: me?.country ?? "",
          address: me?.address ?? "",
          phone: me?.phone ?? "",
          biography: me?.biography ?? "",
          sex: (me?.sex as SexType) ?? "undisclosed",
          birthDate: me?.birthDate ? me.birthDate.slice(0, 10) : "",
        });
      } catch {
        toast.error("No se pudo cargar el perfil");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handlePhotoChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      const sig = await meApi.getUploadSignature(
        `avatars/${profile?.id ?? "me"}`
      );
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("folder", sig.folder);
      form.append("signature", sig.signature);

      const cloudUrl = `https://api.cloudinary.com/${
        sig.cloudName ? `v1_1/${sig.cloudName}` : "v1_1"
      }/auto/upload`;

      const res = await fetch(cloudUrl, { method: "POST", body: form });
      const json = await res.json();

      if (!json?.secure_url) throw new Error("Upload failed");

      const updated = await meApi.updateProfilePicture(json.secure_url);
      setProfile(updated);
      toast.success("Foto de perfil actualizada");
    } catch {
      toast.error("No se pudo subir la imagen");
    } finally {
      setPhotoBusy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }

  function handleOpenFileDialog() {
    if (photoBusy) return;
    fileInputRef.current?.click();
  }

  if (loading) return <div>Cargando…</div>;

  const avatarSrc = resolveAvatarSrc(profile);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Título */}
      <div>
        <h1 className="text-xl font-semibold text-custume-blue">
          Mi perfil
        </h1>
        <p className="text-sm text-custume-gray mt-1">
          Actualiza tu información personal y tu foto de perfil.
        </p>
      </div>

      {/* Card principal */}
      <div className="bg-white rounded-2xl border border-light-blue/40 shadow-sm p-6 md:p-8 space-y-6">
        {/* Header con avatar */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="flex flex-col items-center gap-3">
            <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-light-blue shadow-sm">
              {avatarSrc ? (
                <Image
                  src={avatarSrc}
                  alt="avatar"
                  fill
                  sizes="112px"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-light-blue grid place-items-center text-custume-blue text-xs">
                  Sin foto
                </div>
              )}
            </div>

            {/* Input oculto */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
              disabled={photoBusy}
            />

            <DarkButton
              type="button"
              text={photoBusy ? "Subiendo..." : "Cambiar foto"}
              disabled={photoBusy}
              // @ts-ignore: asumimos que DarkButton pasa onClick al botón interno
              onClick={handleOpenFileDialog}
            />

            <p className="text-[11px] text-custume-gray text-center leading-snug">
              JPG, PNG o WEBP. Idealmente una imagen cuadrada.
            </p>
          </div>

          {/* Resumen rápido del usuario */}
          <div className="w-full md:flex-1 space-y-1 text-center md:text-left">
            <p className="text-base font-semibold text-custume-blue">
              {formik.values.name || "Nombre del usuario"}
            </p>
            <p className="text-sm text-custume-gray">
              @{formik.values.username || "username"}
            </p>
            <p className="text-xs text-custume-gray mt-2">
              Esta información será visible para otros usuarios cuando interactúen contigo.
            </p>
          </div>
        </div>

        {/* Formulario */}
        <form
          onSubmit={formik.handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5"
        >
          <div>
            <label className="hind text-sm text-custume-gray">Nombre</label>
            <input className={fieldsBase} {...formik.getFieldProps("name")} />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">
              Nombre de usuario
            </label>
            <input
              className={fieldsBase}
              {...formik.getFieldProps("username")}
            />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">Ciudad</label>
            <input className={fieldsBase} {...formik.getFieldProps("city")} />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">Estado</label>
            <input className={fieldsBase} {...formik.getFieldProps("state")} />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">País</label>
            <input
              className={fieldsBase}
              {...formik.getFieldProps("country")}
            />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">
              Dirección
            </label>
            <input
              className={fieldsBase}
              {...formik.getFieldProps("address")}
            />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">
              Teléfono
            </label>
            <input className={fieldsBase} {...formik.getFieldProps("phone")} />
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">Sexo</label>
            <select className={fieldsBase} {...formik.getFieldProps("sex")}>
              <option value="undisclosed">Prefiero no decirlo</option>
              <option value="male">Hombre</option>
              <option value="female">Mujer</option>
              <option value="other">Otro</option>
            </select>
          </div>

          <div>
            <label className="hind text-sm text-custume-gray">
              Fecha de nacimiento
            </label>
            <input
              type="date"
              className={fieldsBase}
              {...formik.getFieldProps("birthDate")}
            />
          </div>

          <div className="md:col-span-2">
            <label className="hind text-sm text-custume-gray">
              Biografía
            </label>
            <textarea
              rows={3}
              className={fieldsBase}
              {...formik.getFieldProps("biography")}
            />
          </div>

          <div className="md:col-span-2 flex justify-end gap-2 pt-2">
            <DarkButton text="Guardar cambios" type="submit" />
          </div>
        </form>
      </div>
    </div>
  );
}
