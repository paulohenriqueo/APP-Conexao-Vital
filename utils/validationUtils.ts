// Utility functions for input validation and masking

/**
 * ✅ CPF Validation
 */
export const isValidCPF = (cpf: string): boolean => {
    const cleaned = cpf.replace(/\D/g, "");
    if (cleaned.length !== 11 || /^(\d)\1+$/.test(cleaned)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(cleaned[i]) * (10 - i);
    let check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    if (check !== parseInt(cleaned[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(cleaned[i]) * (11 - i);
    check = 11 - (sum % 11);
    if (check >= 10) check = 0;
    return check === parseInt(cleaned[10]);
};

/**
 * ✅ CPF Mask
 */
export const maskCPF = (value: string): string => {
    let cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)}.${cleaned.slice(3)}`;
    if (cleaned.length <= 9)
        return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)}.${cleaned.slice(3, 6)}.${cleaned.slice(
        6,
        9
    )}-${cleaned.slice(9)}`;
};

/**
 * ✅ Phone Mask
 */
export const maskPhone = (value: string): string => {
    let cleaned = value.replace(/\D/g, "").slice(0, 11);
    if (cleaned.length <= 2) return `(${cleaned}`;
    if (cleaned.length <= 7)
        return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

/**
 * ✅ CEP Mask
 */
export const maskCEP = (value: string): string => {
    let cleaned = value.replace(/\D/g, "").slice(0, 8);
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5)}`;
};

/**
 * ✅ Email Validation
 */
export const isValidEmail = (email: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * ✅ Password Strength Validation
 */
export const isStrongPassword = (password: string): boolean => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
};

/**
 * ✅ Phone Validation
 * Checks if the phone has at least 10 digits (including DDD)
 */
export const isValidPhone = (phone: string): boolean => {
    const cleaned = phone.replace(/\D/g, ""); // remove qualquer caractere que não seja número
    return cleaned.length >= 10 && cleaned.length <= 11;
};
