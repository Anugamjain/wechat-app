import { createSlice } from '@reduxjs/toolkit';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuth: false,
    user: null,
    otp: {
      contact: '',
      hash: '',
    }
  },
  reducers: {
    setAuth: (state, action) => {
      const user = action.payload;
      state.user = user;
      state.isAuth = (user != null);
    },
    setOtp: (state, action) => {
      state.otp = action.payload;
    }
  }
});

export const { setAuth, setOtp } = authSlice.actions;
export default authSlice.reducer;
