/** User role type */
export type currentProfileType = "caregiver" | "patient";

/** Base fields shared by all users */
export interface BaseUserProfile {
  uid: string;
  name: string;
  email: string;
  phone: string;
  photoURL?: string;
  role: currentProfileType;

  // Address
  cep?: string;
  street?: string;
  neighborhood?: string;
  city?: string;

  // Common fields
  careCategory?: string; // e.g., "Nursing", "Physiotherapy", "Home care"
  period?: string[]; // e.g., ["Morning", "Afternoon"]
  languages?: string[]; // e.g., ["Portuguese", "English"]
  observations?: string; // General notes

  createdAt?: string;
  updatedAt?: string;
}

/** Fields exclusive to professionals */
export interface ProfessionalSpecifications {
  qualifications?: string[]; // Courses, certifications
  experience?: string[]; // Previous experiences
  availableDays?: string[]; // e.g., ["monday", "tuesday", "wednesday"]
  targetAudience?: string[]; // e.g., elderly, people with disabilities
}

/** Fields exclusive to clients */
export interface ClientSpecifications {
  conditions?: string[]; // Medical conditions
  allergies?: string[];
  medications?: string[];
}

/** Full professional profile */
export interface ProfessionalProfile extends BaseUserProfile {
  role: "caregiver";
  professionalSpecifications?: ProfessionalSpecifications;
}

/** Full client profile */
export interface ClientProfile extends BaseUserProfile {
  role: "patient";
  clientSpecifications?: ClientSpecifications;
}

/** Unified user profile type */
export type UserProfile = ProfessionalProfile | ClientProfile;
