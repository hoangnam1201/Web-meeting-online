import jwt from 'jsonwebtoken';

export const generateToken = (userData, secretKey, tokenLife) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            userData,
            secretKey,
            {
                expiresIn: tokenLife
            },
            (error, token) => {
                if (error) {
                    return reject(error);
                }
                return resolve(token);
            }
        );
    });
}

export const verifyToken = (token, secretKey) => {
    return new Promise((resoleve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resoleve(decoded);
        });
    })
}
