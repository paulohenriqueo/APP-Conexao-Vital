// Utility functions for text formatting

/**
 * Capitalizes each word in a name, except for predefined exceptions like "de", "da", etc.
 * Example: "joão da silva e souza" → "João da Silva e Souza"
 */
export const formatName = (text: string): string => {
  const exceptions = ["de", "da", "do", "dos", "das", "e"];

  return text
    .toLowerCase()
    .split(" ")
    .map((word) =>
      exceptions.includes(word)
        ? word
        : word.charAt(0).toUpperCase() + word.slice(1)
    )
    .join(" ");
};

/**
 * Capitalizes only the first letter of a paragraph, keeping the rest unchanged.
 * Example: "hello world. this is sophia." → "Hello world. this is sophia."
 */
export const capitalizeFirstLetter = (text: string): string => {
  if (!text) return "";
  return text.charAt(0).toUpperCase() + text.slice(1);
};

/**
 * Converts all characters in a text to lowercase.
 * Example: "HELLO WORLD" → "hello world"
 */
export const toLowerCaseText = (text: string): string => {
  if (!text) return "";
  return text.toLowerCase();
};
