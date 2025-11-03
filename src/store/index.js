import { configureStore } from '@reduxjs/toolkit';
import favoriteReducer from './favoriteSlice';

export const store = configureStore({
  reducer: {
    favorite: favoriteReducer,
    // 여기에 RTK Query API reducer를 추가할 수 있습니다.
  },
});