import bcrypt from 'bcrypt';

export const hash = async (text: string, saltRounds: number = 10) => {
  try {
    const result = await bcrypt.hash(text, saltRounds);
    return result;
  } catch (err) {
    console.error('Hashing failed:', err);
  }
};

export const compare = async (text: string, hash: string) => {
  try {
    const result = await bcrypt.compare(text, hash);
    return result;
  } catch (err) {
    console.error('Comparing hash failed:', err);
  }
};