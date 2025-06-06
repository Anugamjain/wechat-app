import sharp from "sharp";
import path from "path";
import userService from "../services/user-service.js";
import UserDto from "../dtos/user-dto.js";

class ActivateController {
  async activate(req, res) {
    const { name, avatar } = req.body;

    if (!name || !avatar) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const matches = avatar.match(/^data:image\/(png|jpeg|jpg);base64,(.+)$/);
    // if string matches, then matches[1] will be file format(jpg | png) and matches[2] will be the base64 encoded image data 

    if (!matches) {
      return res.status(400).json({ message: "Invalid image format" });
    }

    const ext = matches[1];
    const buffer = Buffer.from(matches[2], "base64");
    const imageName = `${Date.now()}-${Math.round(1e9 * Math.random())}.${ext}`;
    const imagePath = path.resolve("storage", imageName);

    try {
      await sharp(buffer)
        .resize({ width: 150 }) // auto height to preserve aspect ratio
        .toFile(imagePath);
    } catch (err) {
      console.error("Sharp Error:", err);
      return res.status(500).json({ message: "Could not process the image" });
    }

   //  res.json({ message: "Request Received" });

    const userId = req.user._id;
    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) return res.status(404).json({ message: "User not found" });
      user.activated = true;
      user.name = name;
      user.avatar = `/storage/${imageName}`;
      await user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong" });
    }
  }
}

export default new ActivateController();
