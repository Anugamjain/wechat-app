import tokenService from "../services/token-service.js";

const authMiddleware =  async (req, res, next) => {
   try {
      const {accesstoken} = req.cookies;
      if (!accesstoken) {
         throw new Error();
      }
      const userData = await tokenService.verifyAccessToken(accesstoken);

      if (!userData) {
         throw new Error();
      }

      const {_id, activated} = userData;
      req.user = {_id, activated};
      
      next();
   } catch (err) {
      res.status(401).json({message: 'Invalid/Expired Token'});
   }
}

export default authMiddleware;