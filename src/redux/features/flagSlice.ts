// store/cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Flags {
  drawer: boolean;
  isCollapsed: boolean;
}

const initialState: Flags = {
  drawer: false,
  isCollapsed: false,
};
const flagSlice = createSlice({
  name: "signUp",
  initialState,
  reducers: {
    setDrawer: (state, action: PayloadAction<boolean>) => {
      state.drawer = action.payload;
    },
    setIsCollapsed: (state, action:PayloadAction<boolean>) => {
      state.isCollapsed = action.payload;
    },
  },
});

export const { setDrawer, setIsCollapsed } = flagSlice.actions;

export default flagSlice.reducer;
