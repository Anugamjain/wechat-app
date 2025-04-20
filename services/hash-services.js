import crypto from 'crypto';

class HashService {
   hashData (data) {
      const hash = crypto.createHmac('sha256', process.env.HASH_SECRET).update(data).digest('hex');
      return hash;
   }
}

export default new HashService();