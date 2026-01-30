const BAPI = process.env.REACT_APP_BACKEND;

const getSocketIOUrl =()=>{
   return process.env.REACT_APP_BACKEND
}


const CLOUDINARY_CLOUD_NAME = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_UPLOAD_PRESET = process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET;

export { getSocketIOUrl, CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET };
export default BAPI;