import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "../helper/variable";

export const cloudinaryService = {
  uploadImage: async (file) => {
    if (!file) return null;
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "post",
        body: data,
      });
      const result = await response.json();
      return result.url;
    } catch (error) {
    //   console.error("Cloudinary upload failed:", error);
      return null;
    }
  },
  
  uploadVideo: async (file) => {
    if (!file) return null;
    
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    data.append("cloud_name", CLOUDINARY_CLOUD_NAME);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/video/upload`, {
        method: "post",
        body: data,
      });
      const result = await response.json();
      return result.url;
    } catch (error) {
    //   console.error("Cloudinary video upload failed:", error);
      return null;
    }
  }
};
