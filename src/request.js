import axios from 'axios';


const request = axios.create({
  baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : ''
});
export default request;
