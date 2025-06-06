import userService from "../services/user-service.js";

class UserController {
   async getUser(req, res) {
      const {userId} = req.params;
      try {
         const user = await userService.findUser({_id: userId});
         res.json({user});
      } catch (error) {
         res.status(401).json({message: 'Error while fetching user data'});
      }
   }
}

export default new UserController();