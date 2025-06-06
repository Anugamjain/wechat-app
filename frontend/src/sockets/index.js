import io from 'socket.io-client'

const socketInit = (user) => {

   const options = {
      forceNew: true,
      reconnectionAttempts: '1',
      // autoConnect: false,
      reconnection: false,
      timeout: 10000,
      transports: ['websocket'], 
      withCredentials: true,
   }
   return io('http://localhost:5500', options);
}

export default socketInit;