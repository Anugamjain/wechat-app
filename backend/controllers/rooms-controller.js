import roomServices from "../services/room-services.js";
import RoomDto from "../dtos/room-dto.js";

class RoomsController{
   async addRoom(req, res) {
      const {topic, roomType} = req.body;
      if (!topic || !roomType) {
         return res.status(400).json({message: 'All fields are required'});
      }
      const room = await roomServices.createRoom({topic, roomType, adminId: req.user._id});
      res.json(new RoomDto(room));
   }
   async getRooms(req, res) {
      try {
         const rooms = await roomServices.getAllRooms(['Open']);
         const allRooms = rooms.map(room => new RoomDto(room));
         res.json({rooms: allRooms});
      } catch (error) {
         res.status(401).json({message: "Error while fetching rooms"});
      }
   }
   async getRoom(req, res) {
      try{
         const {roomId} = req.params;
         const roomInfo = await roomServices.getRoomById(roomId);
         res.json({roomInfo: new RoomDto(roomInfo)});
      } catch (error) {
         res.status(401).json({message: "Cant Get the room Details"});
      }
   }
   async deleteRoom(req, res) {
      try {
         const {roomId} = req.params;
         roomServices.deleteRoomById(roomId);
      } catch (error) {
         res.status(401).json({message: "Error deleting room!"});
      }
   }
}

export default new RoomsController();