import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';

export const generateToken = (userData: {userId: string}, secretKey: string, tokenLife: string) => {
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

export const verifyToken = (token: string, secretKey: string) => {
    return new Promise((resoleve, reject) => {
        jwt.verify(token, secretKey, (error, decoded) => {
            if (error) {
                reject(error);
            }
            resoleve(decoded);
        });
    })
}
