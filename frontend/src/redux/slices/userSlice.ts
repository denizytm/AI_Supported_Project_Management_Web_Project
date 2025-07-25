import { UserType } from "@/types/userType";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user: UserType | null;
}

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setUserNull: (state) => {
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<Partial<UserType>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
    setUserStatus(state, action) {
      if (state.user) {
        state.user.statusName = action.payload;
      }
    },
  },
});

export const { setUser, setUserNull, updateUser, setUserStatus  } = userSlice.actions;
export default userSlice.reducer;
