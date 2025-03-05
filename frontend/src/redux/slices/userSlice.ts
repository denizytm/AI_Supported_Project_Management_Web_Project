import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  id: string;
  name: string;
  lastName: string;
  email: string;
  profficiencyLevelName: number;
  roleName: string;
  statusName: string;
}

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
  },
});

export const { setUser, setUserNull, updateUser } = userSlice.actions;
export default userSlice.reducer;
