import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router-dom';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchSinglePokemon } from '../api/pokemonApi';
import { getTypeColor, formatPokemonId } from '../utils/pokemonUtils';

const DetailWrapper = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 20px;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const DetailHeader = styled.div`
  background-color: ${props => props.$mainColor || '#ccc'};
  padding: 30px;
  color: white;
  border-radius: 10px 10px 0 0;
`;

const TypeBadge = styled.span`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 5px 10px;
  border-radius: 15px;
  margin: 0 5px;
  font-size: 0.9em;
`;

const StatGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  text-align: left;
  margin-top: 20px;
`;

const StatItem = styled.div`
  padding: 10px;
  border-bottom: 1px solid #eee;

  strong {
    display: inline-block;
    width: 100px;
    font-weight: 600;
  }
`;

const Detail = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPokemonDetail = async () => {
      setLoading(true);
      try {
        const data = await fetchSinglePokemon(id);
        setPokemon(data);
      } catch (error) {
        console.error("상세 정보 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPokemonDetail();
  }, [id]);

  if (loading) return <LoadingSpinner />;
  if (!pokemon) return <DetailWrapper>포켓몬 정보를 찾을 수 없습니다.</DetailWrapper>;

  const mainType = pokemon.types[0].type.name;
  const mainColor = getTypeColor(mainType);

  return (
    <DetailWrapper>
      <DetailHeader $mainColor={mainColor}>
        <h1>{pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h1>
        <p>{formatPokemonId(pokemon.id)}</p>
        <img 
          src={pokemon.sprites.other['official-artwork'].front_default} 
          alt={pokemon.name} 
          style={{ width: '150px', height: '150px' }}
        />
        <div>
          {pokemon.types.map((typeInfo, index) => (
            <TypeBadge key={index}>{typeInfo.type.name}</TypeBadge>
          ))}
        </div>
      </DetailHeader>

      <StatGrid>
        <StatItem><strong>키:</strong> {pokemon.height / 10} m</StatItem>
        <StatItem><strong>몸무게:</strong> {pokemon.weight / 10} kg</StatItem>
        {pokemon.stats.map(stat => (
          <StatItem key={stat.stat.name}>
            <strong>{stat.stat.name.toUpperCase()}:</strong> {stat.base_stat}
          </StatItem>
        ))}
        <StatItem><strong>특성:</strong> 
          {pokemon.abilities.map(a => a.ability.name).join(', ')}
        </StatItem>
      </StatGrid>
    </DetailWrapper>
  );
};

export default Detail;