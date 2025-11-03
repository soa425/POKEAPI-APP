import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/common/PokemonCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
// ✨ loadAllPokemonKoNames와 getKoNameCache 임포트
import { fetchInitialPokemonList, fetchPokemonDetails, loadAllPokemonKoNames, getKoNameCache } from '../api/pokemonApi';
import { useLocation } from 'react-router-dom';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 20px;
  padding: 30px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2em;
  padding: 50px;
`;

const Main = () => {
  const [allPokemonData, setAllPokemonData] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  // ✨ 검색 쿼리를 읽고 공백 제거 및 소문자 변환
  const searchTerm = query.get('search')?.toLowerCase().trim() || ''; 

  useEffect(() => {
    const loadPokemon = async () => {
      try {
        // 1. 한국어 이름 캐시를 로드합니다.
        const koNameCache = await loadAllPokemonKoNames(151);

        // 2. 영문 포켓몬 목록 및 상세 정보를 가져옵니다.
        const initialList = await fetchInitialPokemonList(151); 
        const urls = initialList.map(p => p.url);
        const details = await fetchPokemonDetails(urls);

        // 3. 상세 정보와 한국어 이름을 결합합니다. (한국어 이름으로 표시되도록 name을 덮어씁니다.)
        const combinedData = details.map(pokemon => {
          const koName = koNameCache.find(ko => ko.id === pokemon.id);
          return {
            ...pokemon,
            // name 필드를 한국어 이름으로 덮어씁니다.
            name: koName ? koName.koreanName : pokemon.name,
            englishName: pokemon.name // 영문 이름은 별도 필드에 저장
          };
        });

        setAllPokemonData(combinedData);
      } catch (error) {
        console.error("메인 페이지 데이터 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPokemon();
  }, []);

  // 4. 검색어에 따라 데이터를 필터링하는 로직 (한국어 검색 지원)
  const filteredPokemon = allPokemonData.filter(pokemon => 
    // 한국어 이름이 검색어를 포함하는지 확인
    pokemon.name.toLowerCase().includes(searchTerm)
  );

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 style={{ 
        textAlign: 'center', 
        padding: '20px 0', 
        // 검색어가 있을 때만 타이틀 표시
        display: searchTerm ? 'block' : 'none' 
      }}>
        '{searchTerm}' 검색 결과 ({filteredPokemon.length}마리)
      </h2>
      
      {filteredPokemon.length === 0 && searchTerm !== '' ? (
        <Message>'{searchTerm}'에 해당하는 포켓몬을 찾을 수 없습니다.</Message>
      ) : (
        <GridContainer>
          {/* 필터링된 한국어 이름의 포켓몬을 표시 */}
          {filteredPokemon.map(pokemon => (
            <PokemonCard key={pokemon.id} pokemon={pokemon} />
          ))}
        </GridContainer>
      )}
    </div>
  );
};

export default Main;