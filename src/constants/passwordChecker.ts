import bcrypt from "bcrypt";
// const bcrypt = require('bcrypt');

export const isPasswordCorrect = async (inputPassword: string, dbPassword: string) => {
  return await bcrypt.compare(inputPassword, dbPassword);
};
