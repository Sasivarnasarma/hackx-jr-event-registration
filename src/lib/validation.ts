import { z } from "zod";

/**
 * Normalizes repeated spaces in a string to a single space, and trims leading/trailing spaces.
 */
export function normalizeSpaces(str: string): string {
  return str.replace(/\s+/g, " ").trim();
}

/**
 * Normalizes a Sri Lankan mobile number to E.164 format (+947XXXXXXXX).
 * Returns null if the format is invalid.
 */
export function normalizeMobileNumber(phone: string): string | null {
  const clean = phone.replace(/[\s\-\(\)\+]/g, ""); // Remove all whitespace, hyphens, brackets, pluses

  // If it was +947XXXXXXXX, clean will be 947XXXXXXXX (11 digits)
  if (/^947[01245678]\d{7}$/.test(clean)) {
    return `+${clean}`;
  }

  // If it was 07XXXXXXXX, clean will be 07XXXXXXXX (10 digits)
  if (/^07[01245678]\d{7}$/.test(clean)) {
    return `+94${clean.slice(1)}`;
  }

  // If it was just 7XXXXXXXX (9 digits), clean will be 7XXXXXXXX
  if (/^7[01245678]\d{7}$/.test(clean)) {
    return `+94${clean}`;
  }

  return null;
}

/**
 * Normalizes an email address to lowercase and trims spaces.
 */
export function normalizeEmail(email: string | null | undefined): string | null {
  if (!email) return null;
  const clean = email.trim().toLowerCase();
  return clean === "" ? null : clean;
}

export const participantTypes = ["STUDENT", "TEACHER", "PRINCIPAL"] as const;
export const gradeOptions = [
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
  "Grade 13",
  "Other",
] as const;

/**
 * Zod schema for public registration validation.
 * No transforms are used here to prevent TypeScript resolution conflicts in React Hook Form.
 * Normalization is performed upon insertion / database query.
 */
export const registrationSchema = z
  .object({
    fullName: z
      .string()
      .min(3, "Full name must be at least 3 characters")
      .max(100, "Full name cannot exceed 100 characters"),
    mobileNumber: z
      .string()
      .min(9, "WhatsApp number is too short")
      .max(20, "WhatsApp number is too long")
      .refine((val) => normalizeMobileNumber(val) !== null, {
        message: "Please enter a valid Sri Lankan WhatsApp number (e.g. 0771234567)",
      }),
    participantType: z.enum(participantTypes, {
      errorMap: () => ({ message: "Please select a valid participant type" }),
    }),
    school: z
      .string()
      .min(3, "School name must be at least 3 characters")
      .max(150, "School name cannot exceed 150 characters"),
    grade: z.string().optional().or(z.null()),
    turnstileToken: z.string().min(1, "Bot verification is required"),
  })
  .refine(
    (data) => {
      if (data.participantType === "STUDENT") {
        return data.grade !== undefined && data.grade !== null && data.grade !== "";
      }
      return true;
    },
    {
      message: "Grade is required for student participants",
      path: ["grade"],
    }
  )
  .refine(
    (data) => {
      if (data.participantType === "STUDENT") {
        return gradeOptions.includes(data.grade as any);
      }
      return true;
    },
    {
      message: "Please select a valid grade option",
      path: ["grade"],
    }
  );

export type RegistrationInput = z.infer<typeof registrationSchema>;

export const adminRegisterSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name is too long"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username is too long")
    .regex(
      /^[a-zA-Z0-9_\-]+$/,
      "Username can only contain alphanumeric characters, underscores, and hyphens"
    ),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password is too long"),
  turnstileToken: z.string().min(1, "Bot verification is required"),
});

export type AdminRegisterInput = z.infer<typeof adminRegisterSchema>;

export const adminLoginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
  turnstileToken: z.string().min(1, "Bot verification is required"),
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
