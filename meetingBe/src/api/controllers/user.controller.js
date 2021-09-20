import User from '../models/user.model.js';
import CryptoJS from 'crypto-js';
import { validationResult } from 'express-validator';


export const register = async (req, res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors});
    }
    const user = {
        username: req.body.username,
        name: req.body.fullname,
        password: CryptoJS.SHA256(req.body.password),
        phone: req.body.phone,
        email: req.body.email,
        dob: req.body.dob,
        role: 1,
    }

    User.create(user, (err, user) => {
        if (err) {
            return res.status(400).json({ status: 200, data: null, messager: err });
        }
        return res.status(200).json({ status: 200, data: null, messager: 'success' });
    })
}

export const getDetail = async (req, res) => {
    const userId = req.userData.userId;
    User.findById(userId, (err, user) => {
        if (err) {
            return res.status(200).json({ status: 200, data: null, messager: 'not found user' });
        }
        return res.status(200).json({ status: 200, data: user, messager: 'success' });
    })
}
