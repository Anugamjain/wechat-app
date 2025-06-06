import jwt from 'jsonwebtoken';
import RefreshModel from '../models/refresh-model.js';
import dotenv from 'dotenv';
dotenv.config();

class TokenService {
   generateTokens(payload) {
      const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {expiresIn: '20m'});
      const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn: '1y'});
      return {accessToken, refreshToken};
   }
   async storeRefreshToken(token, userId) {
      try{
         const tok = await RefreshModel.create({token, userId});
      } catch (err) {
         console.log(err.message);
      }
   }
   async findRefreshToken(userId, refreshToken) {
      return await RefreshModel.findOne({userId: userId, token: refreshToken});
   }
   async updateRefreshToken(userId, refreshToken) {
      return await RefreshModel.updateOne({userId: userId}, {token: refreshToken});
   }
   async verifyAccessToken(accessToken) {
      return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET);
   }
   async verifyRefreshToken(refreshToken) {
      return jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
   }

   async storeRefreshToken(token, userId) {
      try{
         const tok = await RefreshModel.create({token, userId});
      } catch (err) {
         console.log(err.message);
      }
   }
   async removeToken(refreshToken) {
      try {
         await RefreshModel.deleteOne({ token: refreshToken });
      } catch (err) {
         console.log(err.message);
      }
   }   
}

export default new TokenService();