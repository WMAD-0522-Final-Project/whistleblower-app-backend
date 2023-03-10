// import { Types } from 'mongoose';
// import jwt from 'jsonwebtoken';
// import { RequestHandler } from 'express';

// import User from '../models/user';
// import { IUser } from '../types';

// const checkAuth: RequestHandler = async (req, res, next) => {
//   try {
//     const authorizationHeader = req.headers.authorization;
//     if (!authorizationHeader) {
//       return res.status(401).json({
//         message: 'Please provide authorization header.',
//       });
//     }
//     const token = authorizationHeader.split(' ')[1];
//     const decodedToken = jwt.verify(token, process.env.JWT_SECRET!);

//     const user = await User.findById(decodedToken.user._id);

//     if (!user) {
//       return res.status(401).json({
//         message: 'Auth failed. User not exist.',
//       });
//     }
//     res.userData = {
//       user: {
//         ...user._doc,
//         password: undefined,
//       },
//     };

//     next();
//   } catch (err) {
//     next(err);
//   }
// };
