import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import PokemonCard from '../components/common/PokemonCard';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2em;
  padding: 50px;
`;

const Favorite = () => {
  // 전역 상태 관리 (Redux)에서 찜 목록 데이터를 가져옴
  const favorites = useSelector(state => state.favorite.favorites);

  return (
    <div>
      <h2 style={{ textAlign: 'center', padding: '20px 0' }}>🌟 찜 목록</h2>
      {favorites.length === 0 ? (
        <Message>찜한 포켓몬이 없습니다. 메인 페이지에서 포켓몬을 추가해보세요!</Message>
      ) : (
        <GridContainer>
          {favorites.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </GridContainer>
      )}
    </div>
  );
};

export default Favorite;