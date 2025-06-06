import UserModel from '../models/user-model.js';

class UserService {
   async findUser(filter) {
      const user = UserModel.findOne(filter);
      return user;
   }

   async createUser(data) {
      const user = UserModel.create(data);
      return user;
   }
}

export default new UserService();