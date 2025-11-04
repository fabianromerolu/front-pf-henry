"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { meApi } from "@/services/userRenter.service";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import DarkButton from "@/components/Buttoms/DarkButtom";
import LightButton from "@/components/Buttoms/LightButtom";
import type { UserProfile } from "@/services/userRenter.service";

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
  sex: Yup.mixed<SexType>().oneOf(["male", "female", "other", "undisclosed"]),
  birthDate: Yup.string().nullable(),
});

export default function MyProfile() {
  const [loading, setLoading] = useState(true);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);

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
          birthDate: values.birthDate ? new Date(values.birthDate).toISOString() : null,
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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoBusy(true);
    try {
      const sig = await meApi.getUploadSignature(`avatars/${profile?.id ?? "me"}`);
      const form = new FormData();
      form.append("file", file);
      form.append("api_key", sig.apiKey);
      form.append("timestamp", String(sig.timestamp));
      form.append("folder", sig.folder);
      form.append("signature", sig.signature);
      const cloudUrl = `https://api.cloudinary.com/${sig.cloudName ? `v1_1/${sig.cloudName}` : "v1_1"}/auto/upload`;
      const res = await fetch(cloudUrl, { method: "POST", body: form });
      const json = await res.json();
      if (!json?.public_id) throw new Error("Upload failed");

      const updated = await meApi.updateProfilePicture(json.public_id);
      setProfile(updated);
      toast.success("Foto de perfil actualizada");
    } catch {
      toast.error("No se pudo subir la imagen");
    } finally {
      setPhotoBusy(false);
    }
  }

  if (loading) return <div>Cargando…</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-light-blue">
          {profile?.profilePicture ? (
            <Image
              src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ?? ""}/image/upload/${profile.profilePicture}.jpg`}
              alt="avatar"
              fill
              sizes="80px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-light-blue grid place-items-center text-custume-blue">
              No img
            </div>
          )}
        </div>
        <label className="inline-flex items-center gap-2">
          <input type="file" accept="image/*" onChange={handlePhotoChange} disabled={photoBusy} />
          <DarkButton text={photoBusy ? "Uploading..." : "Change photo"} disabled={photoBusy} />
        </label>
      </div>

      {/* Form */}
      <form onSubmit={formik.handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="hind text-sm text-custume-gray">Name</label>
          <input className={fieldsBase} {...formik.getFieldProps("name")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Username</label>
          <input className={fieldsBase} {...formik.getFieldProps("username")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">City</label>
          <input className={fieldsBase} {...formik.getFieldProps("city")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">State</label>
          <input className={fieldsBase} {...formik.getFieldProps("state")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Country</label>
          <input className={fieldsBase} {...formik.getFieldProps("country")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Address</label>
          <input className={fieldsBase} {...formik.getFieldProps("address")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Phone</label>
          <input className={fieldsBase} {...formik.getFieldProps("phone")} />
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Sex</label>
          <select className={fieldsBase} {...formik.getFieldProps("sex")}>
            <option value="undisclosed">Undisclosed</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label className="hind text-sm text-custume-gray">Birth date</label>
          <input type="date" className={fieldsBase} {...formik.getFieldProps("birthDate")} />
        </div>
        <div className="md:col-span-2">
          <label className="hind text-sm text-custume-gray">Biography</label>
          <textarea rows={3} className={fieldsBase} {...formik.getFieldProps("biography")} />
        </div>

        <div className="md:col-span-2 flex gap-2">
          <DarkButton text="Save changes" type="submit" />
          <LightButton text="Reset" type="button" onClick={() => formik.resetForm()} />
        </div>
      </form>
    </div>
  );
}
