import tokenService from "../services/token-service.js";

const authMiddleware =  async (req, res, next) => {
   try {
      const {accesstoken} = req.cookies;

      if (!accesstoken) {
         console.log('No access token provided');
         throw new Error();
      }
      const userData = await tokenService.verifyAccessToken(accesstoken);

      if (!userData) {
         console.log('Invalid or expired access token');
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