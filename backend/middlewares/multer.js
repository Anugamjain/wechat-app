import multer from "multer";

const storage = multer.memoryStorage(); // We'll pass buffer directly to cloudinary
const upload = multer({ storage });

export default upload;
