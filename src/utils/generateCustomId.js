import Case from "../models/cases";
import User from "../models/user";

export const generateCustomId = async () => {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  const generateId = () => {
    const prefix =
      letters.charAt(Math.floor(Math.random() * 26)) +
      letters.charAt(Math.floor(Math.random() * 26));
    const number = String(Math.floor(Math.random() * 100000)).padStart(5, '0');
    return `${prefix}-${number}`;
  };

  let uniqueId;
  let exists = true;
  let attempts = 0;
  const maxAttempts = 10;

  while (exists && attempts < maxAttempts) {
    uniqueId = generateId();

    const userFound = await User.findOne({ uniqueId });
    const caseFound = await Case.findOne({ uniqueId });

    exists = !!(userFound || caseFound);
    attempts++;
  }

  if (exists) {
    throw new Error('Unable to generate unique ID after multiple attempts');
  }

  return uniqueId;
};
