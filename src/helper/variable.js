const BAPI = process.env.REACT_APP_BACKEND;

const getSocketIOUrl =()=>{
   return process.env.REACT_APP_BACKEND
}

export { getSocketIOUrl };
export default BAPI;