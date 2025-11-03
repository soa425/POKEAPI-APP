import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  // localStorage에서 초기 찜 목록 로드
  favorites: JSON.parse(localStorage.getItem('pokemonFavorites')) || [],
};

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState,
  reducers: {
    // 찜 목록에 추가
    addFavorite: (state, action) => {
      const pokemon = action.payload;
      if (!state.favorites.some(fav => fav.id === pokemon.id)) {
        state.favorites.push(pokemon);
        localStorage.setItem('pokemonFavorites', JSON.stringify(state.favorites));
      }
    },
    // 찜 목록에서 제거
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(fav => fav.id !== action.payload.id);
      localStorage.setItem('pokemonFavorites', JSON.stringify(state.favorites));
    },
  },
});

export const { addFavorite, removeFavorite } = favoriteSlice.actions;
export default favoriteSlice.reducer;