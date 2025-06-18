import sharp from "sharp";
import path from "path";
import fs from "fs";
import userService from "../services/user-service.js";
import UserDto from "../dtos/user-dto.js";

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const matches = avatar.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    if (!matches) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const ext = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const imageName = `${Date.now()}-${Math.round(1e9 * Math.random())}.${ext}`;
    const imagePath = path.resolve("storage", imageName);

    // Ensure 'storage' directory exists
    try {
      const storageDir = path.resolve("storage");
      if (!fs.existsSync(storageDir)) {
        fs.mkdirSync(storageDir);
      }
    } catch (err) {
      console.error("Storage directory creation error:", err);
      return res.status(500).json({ message: "Server configuration error" });
    }

    try {
      await sharp(buffer)
        .resize({ width: 150 })
        .toFile(imagePath);
    } catch (err) {
      console.error("Sharp image processing failed:", err.message);
      return res.status(500).json({ message: "Image processing failed. Try a different image." });
    }

    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "Unauthorized. Missing user." });
    }

    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imageName}`;
      await user.save();

      return res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      console.error("Database update error:", err.message);
      return res.status(500).json({ message: "Failed to update user profile" });
    }
  }
}

export default new ActivateController();
