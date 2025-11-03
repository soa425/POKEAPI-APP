import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addFavorite, removeFavorite } from '../../store/favoriteSlice';

const CardWrapper = styled(Link)`
  background-color: white; 
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08); 
  padding: 10px;
  text-align: center;
  transition: transform 0.2s ease-in-out;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-decoration: none; 
  color: #333; 
  cursor: pointer;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  }
`;

const PokemonImage = styled.img`
  width: 96px; 
  height: 96px;
  object-fit: contain;
  margin-bottom: 5px;
`;

const NameAndFavorite = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-weight: bold;
  font-size: 1.1em;
  text-transform: capitalize;
  padding-top: 5px;
`;

const FavoriteIcon = styled.span`
  color: ${props => (props.$isFavorite ? '#ff4500' : '#ccc')};
  font-size: 1.2em;
  cursor: pointer;
  z-index: 10;
  &:hover {
    color: ${props => (props.$isFavorite ? '#cc3700' : '#999')};
  }
`;

const PokemonCard = ({ pokemon }) => {
  const dispatch = useDispatch();
  const favorites = useSelector(state => state.favorite.favorites);
  const isFavorite = favorites.some(fav => fav.id === pokemon.id);

  const handleFavoriteToggle = (e) => {
    e.preventDefault(); 
    e.stopPropagation(); 

    if (isFavorite) {
      dispatch(removeFavorite(pokemon));
    } else {
      dispatch(addFavorite(pokemon));
    }
  };

  return (
    <CardWrapper to={`/pokemon/${pokemon.id}`}>
      <PokemonImage 
        src={pokemon.sprites.front_default} 
        alt={pokemon.name} 
      />
      <NameAndFavorite>
        <span>{pokemon.name}</span>
        <FavoriteIcon onClick={handleFavoriteToggle} $isFavorite={isFavorite}>
          {isFavorite ? '♥' : '♡'}
        </FavoriteIcon>
      </NameAndFavorite>
    </CardWrapper>
  );
};

export default PokemonCard;