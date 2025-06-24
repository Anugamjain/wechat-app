import cloudinary from "../config/cloudinary.js";
import userService from "../services/user-service.js";
import UserDto from "../dtos/user-dto.js";

class ActivateController {
  async activate(req, res) {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({ message: "All fields are required!" });
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

      // Delete previous avatar from cloudinary, if exists
      if (user.avatar) {
        const segments = user.avatar.split("/");
        const publicIdWithExt = segments.slice(-2).join("/"); // e.g., avatars/t6wlsagxhel9g4icrfsz.jpg
        const publicId = publicIdWithExt.split(".")[0]; // Remove extension
        await cloudinary.uploader.destroy(publicId);
      }

      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "avatars",
            resource_type: "image",
            transformation: [{ width: 150, crop: "scale" }],
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        if (!uploadStream) {
          return reject(new Error("Failed to create upload stream"));
        }
        uploadStream.end(file.buffer);
      });

      user.activated = true;
      user.name = name;
      user.avatar = result.secure_url;

      await user.save();

      return res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      console.error("Cloudinary upload failed:", err.message);
      return res.status(500).json({ message: "Image upload failed" });
    }
  }
}

export default new ActivateController();
