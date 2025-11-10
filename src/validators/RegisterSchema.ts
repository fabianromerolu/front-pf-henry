import * as Yup from "yup";

// Roles permitidos desde el front (ADMIN lo decide el back por dominio)
export type AppRole = "USER" | "RENTER";

// Interface para el formulario de registro
export interface RegisterFormValues {
  name: string;
  username: string;
  email: string;
  phone?: string;         // opcional
  role?: AppRole;         // opcional (USER/RENTER)
  password: string;
  confirmPassword: string;
}
const PASS_RX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).+$/;

// Valores iniciales
export const RegisterInitialValues: RegisterFormValues = {
  name: "",
  username: "",
  email: "",
  phone: "",
  role: "USER",
  password: "",
  confirmPassword: "",
};

const RESERVED_USERNAMES = [
  "admin",
  "root",
  "support",
  "null",
  "undefined",
  "system",
  "owner",
  "help",
  "contact",
];

// Esquema de validación
export const RegisterValidationSchema = Yup.object({
  name: Yup.string()
    .transform((v) => (v ?? "").trim().replace(/\s+/g, " "))
    .min(2, "Name must be at least 2 characters long")
    .max(60, "Name cannot exceed 60 characters")
    .matches(/^\p{L}+(?:[ '\-]\p{L}+)*$/u, "Name can only contain letters and spaces")
    .required("Name is required"),

  username: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .min(4, "Username must be at least 4 characters long")
    .max(20, "Username cannot exceed 20 characters")
    .matches(
      /^(?!.*__)[a-z0-9](?:[a-z0-9_]{2,18})[a-z0-9]$/,
      "Only lowercase letters, numbers, and underscores; no consecutive '__', cannot start or end with _"
    )
    .notOneOf(RESERVED_USERNAMES, "This username is reserved")
    .required("Username is required"),

  email: Yup.string()
    .transform((v) => (v ?? "").trim().toLowerCase())
    .email("Invalid email address")
    .max(254, "Email is too long")
    .required("Email is required"),

  phone: Yup.string()
    .transform((v) => (v ?? "").trim())
    .optional()
    .test("phone-format", "Invalid phone", (v) => {
      if (!v) return true;
      return /^[+()\-\s\d]{7,20}$/.test(v);
    }),

  role: Yup.string<AppRole>()
    .oneOf(["USER", "RENTER"])
    .optional(),

  password: Yup.string()
    .min(8, "Password must be at least 8 characters long")
    .max(64, "Password cannot exceed 64 characters")
    .matches(PASS_RX, "Must include uppercase, lowercase, number and symbol (!@#$%^&*).")
    .matches(/^\S+$/, "Spaces are not allowed in the password")
    .test(
      "no-personal-data",
      "Password must not contain your name, username, or email prefix",
      function (value) {
        if (!value) return false;
        const v = value.toLowerCase();
        const { name, username, email } = this.parent as RegisterFormValues;
        const emailLocal = (email ?? "").toLowerCase().split("@")[0] || "";
        const nameFlat = (name ?? "").toLowerCase().replace(/\s+/g, "");
        return !(
          (username && v.includes(username.toLowerCase())) ||
          (emailLocal && v.includes(emailLocal)) ||
          (name && nameFlat && v.includes(nameFlat))
        );
      }
    )
    .required("Password is required"),

  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .matches(PASS_RX, "Must include uppercase, lowercase, number and symbol (!@#$%^&*).")
    .required("Confirm password is required"),
});
