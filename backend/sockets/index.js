import { ACTIONS } from "../actions.js";

function registerSocketHandlers(io, socket, socketUserMapping) {
  console.log("A user connected:", socket.id, socket.handshake.auth.user?.name);
  let hasLeft = false;

  socket.on(ACTIONS.JOIN, handleJoin);
  socket.on(ACTIONS.RELAY_ICE, handleRelayIce);
  socket.on(ACTIONS.RELAY_SDP, handleSDP);
  socket.on(ACTIONS.MUTE, handleMute);
  socket.on(ACTIONS.UN_MUTE, handleUnMute);
  socket.on(ACTIONS.LEAVE, leaveRoom);
  socket.on("disconnecting", leaveRoom);

  async function handleJoin({ roomId, user }) {
    socketUserMapping[socket.id] = user;

    socket.join(roomId); // Join first!

    // Now get the clients in the room
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    console.log("clients in room", clients);

    clients.forEach((clientId) => {
      if (clientId === socket.id) return; // Don't connect to self

      // Notify existing clients about the new peer
      io.to(clientId).emit(ACTIONS.ADD_PEER, {
        peerId: socket.id,
        createOffer: false,
        user,
      });

      // Notify the new client about existing peers
      socket.emit(ACTIONS.ADD_PEER, {
        peerId: clientId,
        createOffer: true,
        user: socketUserMapping[clientId],
      });
    });
  }

  async function handleRelayIce({ peerId, icecandidate }) {
    io.to(peerId).emit(ACTIONS.ICE_CANDIDATE, {
      peerId: socket.id,
      icecandidate,
    });
  }

  // Handle relay SDP (session description)
  async function handleSDP({ peerId, sessionDescription }) {
    io.to(peerId).emit(ACTIONS.SESSION_DESCRIPTION, {
      peerId: socket.id,
      sessionDescription,
    });
  }

  function handleMute({ roomId, userId }) {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    console.log("mute", userId, clients);
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.MUTE, { userId });
    });
  }
  

  function handleUnMute({ roomId, userId }) {
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
    console.log("unmute", userId, clients);
    
    clients.forEach((clientId) => {
      io.to(clientId).emit(ACTIONS.UN_MUTE, { userId });
    });
  }

  // Leaving the room
  async function leaveRoom({ roomId }) {
    if (hasLeft) return;
    hasLeft = true;

    const { rooms } = socket;
    console.log(socket.id, "leaved", socketUserMapping[socket.id]?.name);
    Array.from(rooms).forEach((roomId) => {
      const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);
      clients.forEach((clientId) => {
        io.to(clientId).emit(ACTIONS.REMOVE_PEER, {
          peerId: socket.id,
          userId: socketUserMapping[socket.id]?.id,
        });
        socket.emit(ACTIONS.REMOVE_PEER, {
          peerId: clientId,
          userId: socketUserMapping[clientId]?.id,
        });
      });
      socket.leave(roomId);
    });
    delete socketUserMapping[socket.id];
  }
}

export default registerSocketHandlers;
