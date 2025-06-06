class RoomDto {
   constructor(room) {
      this.id = room._id;
      this.roomType = room.roomType;
      this.topic = room.topic;
      this.adminId = room.adminId;
      this.speakers = room.speakers;
      this.createdAt = room.createdAt;
   }
}

export default RoomDto;