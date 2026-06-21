import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  profile: null,
  loading: false,
};

const userSlice = createSlice({
  name: 'userProfile',
  initialState,
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
    setProfileLoading: (state, action) => {
      state.loading = action.payload;
    },
    clearProfile: (state) => {
      state.profile = null;
    },
  },
});

export const { setProfile, setProfileLoading, clearProfile } = userSlice.actions;
export default userSlice.reducer;
