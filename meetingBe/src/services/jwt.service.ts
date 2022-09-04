import jwt from "jsonwebtoken";

export const generateToken = (
  userData: { userId: string },
  secretKey: string,
  tokenLife: string
) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(
      userData,
      secretKey,
      {
        expiresIn: tokenLife,
      },
      (error, token) => {
        if (error) {
          return reject(error);
        }
        return resolve(token);
      }
    );
  });
};

export const verifyToken = (token: string, secretKey: string) => {
  return new Promise<{ userId: string }>((resoleve, reject) => {
    jwt.verify(token, secretKey, (error, decoded: { userId: string }) => {
      if (error) {
        reject(error);
      }
      resoleve(decoded);
    });
  });
};
