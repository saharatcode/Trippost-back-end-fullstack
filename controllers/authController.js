const bcryptjs = require('bcryptjs');
const { json } = require('sequelize');
const jwt = require('jsonwebtoken')
const {User} = require('../models')
const emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;


exports.register = async (req, res, next) => {
    try {
        const {firstName, lastName, email, password, confirmPassword,} = req.body;
        if (password !== confirmPassword){
            return res.status(400).json({ message: 'password and confirm password did not macth.'})
        } 

        const isEmailForm = emailFormat.test(email)
        if(isEmailForm) {

            const existUser = await User.findOne({
                where: {email: email}
            });
            
            if(existUser) {
                return res.status(400).json({message: 'this email alredy taken.'})
                
            }
            
        const hashPassword = await bcryptjs.hash(password, 10)
        await User.create({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: hashPassword,
            
        })
        res.status(201).json({message: 'User created.'})
    }
        

    } catch(err) {
        next(err)
    }
};

exports.login = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const isEmailForm = emailFormat.test(email)
        let user;
        
        if(isEmailForm) {
            user = await User.findOne({ where: {email: email}})
        } 

        if(!user) {
            return res.status(400).json({message: "email or password is wrong!"})
        }

        const isMacthPassword = await bcryptjs.compare(password, user.password);
        if(!isMacthPassword) {
            return res.status(400).json({message: "email or password is wrong!"})
        }

        const payload = {id: user.id, firstName: user.firstName, lastName: user.lastName };
        // token คือสิ่งที่ต้อง response ออกไป
        const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn: 60 * 60 * 24 *30})

        res.status(200).json({token});
        

    } catch(err) {
        next(err);
    }
};