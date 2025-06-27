import RoomModel from "../models/room-model.js";

class RoomService {
  async createRoom({ topic, roomType, adminId }) {
    const room = await RoomModel.create({
      topic,
      roomType,
      adminId,
      speakers: [adminId],
    });
    return room;
  }
  async getAllRooms(types) {
    return await RoomModel.find({ roomType: { $in: types } })
      .populate("speakers")
      .populate("adminId")
      .exec(); // filter rooms on all provided room types
  }
  async getRoomById(roomId) {
    const room = await RoomModel.findById(roomId).populate('speakers').populate("adminId");
    return room;
  }
  async deleteRoomById(roomId) {
    await RoomModel.deleteOne({_id: roomId});
  }
}

export default new RoomService();
