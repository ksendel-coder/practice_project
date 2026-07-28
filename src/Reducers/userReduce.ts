import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserData {
  _id?: number;
  name: string;
  email: string;
  bio: string;
  avatar?: string | null;
}

interface UserState {
  isAuth: boolean;
  userData: UserData | null;
}

const loadUserState = (): UserState => {
  try {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("userData");
    if (token && userData) {
      return {
        isAuth: true,
        userData: JSON.parse(userData),
      };
    }
  } catch (error) {
    console.error(error);
  }
  return {
    isAuth: false,
    userData: null,
  };
};

export const initialState: UserState = loadUserState();

const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signIn: (state, action: PayloadAction<UserData>) => {
      state.isAuth = true;
      state.userData = action.payload;
    },
    signOut: (state) => {
      state.isAuth = false;
      state.userData = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    },
    updateUser: (state, action: PayloadAction<UserData>) => {
      if (state.userData) {
        state.userData = { ...state.userData, ...action.payload };
        localStorage.setItem("userData", JSON.stringify(state.userData));
      }
    },
  },
});

export const { signIn, signOut, updateUser } = UserSlice.actions;
export default UserSlice.reducer;
