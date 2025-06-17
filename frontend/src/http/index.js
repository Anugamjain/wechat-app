import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "content-type": "application/json",
    Accept: "application/json",
   //  Cookie:
   //    "accesstoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODUxMDhkZDk5MjA3MDIxZjAyN2JmODkiLCJhY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE3NTAxNzk5ODYsImV4cCI6MTc1MDE4MTE4Nn0.IeYbj8DBOKCbq7eWKd-86pYix6FRmv8MFcQRXjpHztM;refreshtoken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2ODUxMDhkZDk5MjA3MDIxZjAyN2JmODkiLCJhY3RpdmF0ZWQiOmZhbHNlLCJpYXQiOjE3NTAxNzk5ODYsImV4cCI6MTc4MTczNzU4Nn0.f9U56ZbDpVaSpBFLtf2S5Cna4pbdANX4z8JLkl7Q3DU",
  },
  withCredentials: true,
});

// list of end points
export const sendOtp = (data) => api.post("/api/send-otp", data);

export const verifyOtp = (data) => api.post("/api/verify-otp", data);

export const activate = (data) => api.post("/api/activate", data);

export const logout = () => api.post("/api/logout");

export const createRoom = (data) => api.post("/api/create-room", data);

export const getAllRooms = () => api.get("/api/rooms");

export const getRoomById = (roomId) => api.get(`/api/room/${roomId}`);

export const getUser = (id) => api.get(`/api/user/${id}`);

// Interceptor
api.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest.isRetry
    ) {
      originalRequest.isRetry = true;
      try {
        await axios.get(`${process.env.REACT_APP_API_URL}/api/refresh`, {
          withCredentials: true,
        });
        return api.request(originalRequest);
      } catch (err) {
        console.log(err.message);
      }
    }
    throw error;
  }
);

export default api;
