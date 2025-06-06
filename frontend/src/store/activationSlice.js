import { createSlice } from '@reduxjs/toolkit';

const activateSlice = createSlice({
  name: 'activate',
  initialState: {
      name: 'John Doe',
      avatar: '/images/monkey-avatar.png'
   },
  reducers: {
    setName: (state, action) => {
      state.name = action.payload;
    },
    setAvatar: (state, action) => {
      state.avatar = action.payload;
    }
  }
});

export const { setAvatar, setName } = activateSlice.actions;
export default activateSlice.reducer; 
