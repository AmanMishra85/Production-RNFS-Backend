import bcrypt, { compare } from "bcrypt";

// HASH
export const hashPassword = (password) => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      }
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        }
        resolve(hash);
      });
    });
  });
};
 
// DECRYPT

export const comparePassword = (password,hashPassword)=>{
    return bcrypt.compare(password,hashPassword);
}