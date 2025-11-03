import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import PokemonCard from '../components/common/PokemonCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { fetchSinglePokemon, fetchPokemonNameKo } from '../api/pokemonApi'; 


const SearchContainer = styled.div`
  max-width: 800px;
  margin: 30px auto;
  padding: 0 20px;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 15px;
  font-size: 1.2em;
  border: 2px solid #ddd;
  border-radius: 8px;
  margin-bottom: 30px;
  box-sizing: border-box;
`;

const SearchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 25px;
  justify-content: center;
`;

const Message = styled.p`
  text-align: center;
  font-size: 1.2em;
  padding: 30px;
`;

const ContentWrapper = styled.div`
  /* 로딩, 결과, 메시지 등 모든 동적 콘텐츠를 감싸는 컨테이너 */
  min-height: 200px; /* 콘텐츠 영역의 최소 높이 확보 */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;


const Search = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const performSearch = async () => {

        const trimmedSearchTerm = searchTerm.trim().toLowerCase(); 

      if (trimmedSearchTerm === '') {
        setSearchResult(null);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);
      setSearchResult(null);

      let identifier = trimmedSearchTerm;
      const isKorean = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(identifier);
      let koreanName = null;

      try {
        if (isKorean) {
          // 1. 한국어 이름으로 species 데이터를 요청합니다.
          // PokeAPI는 한글 이름을 ID로 인식하려 시도하므로, 이 요청은 실패할 가능성이 높습니다. 
          // 하지만 try-catch 문을 통해 이를 처리합니다.
          let speciesData;
          try {
            // 사용자 입력으로 첫 시도
            speciesData = await fetchPokemonNameKo(identifier);
          } catch (e) {
            // 첫 시도가 실패하면 (일반적으로 한글 검색 시) 에러를 발생시킵니다.
            throw new Error(`정확한 '${searchTerm}' 포켓몬 정보를 찾을 수 없습니다. (API 실패)`);
          }
          
          // 2. API가 ID를 찾았다면, 해당 포켓몬의 한국어 이름을 가져와 사용자의 입력과 비교합니다.
          const koNameCheck = await fetchPokemonNameKo(speciesData.id);
          
          // 수정된 비교 로직: API에서 가져온 한국어 이름과 사용자 입력이 정확히 일치하는지 확인
          if (koNameCheck.koreanName.toLowerCase().trim() === identifier) {
            identifier = koNameCheck.englishName; // 영문 이름으로 최종 변경
            koreanName = koNameCheck.koreanName;
          } else {
            // 이름이 부분적으로 일치하지 않을 경우 
            throw new Error(`'${searchTerm}' (와)과 일치하는 포켓몬 이름을 찾을 수 없습니다.`);
          }
        }
        
        // 3. 최종 영문 이름(identifier)으로 상세 정보 요청
        const data = await fetchSinglePokemon(identifier);

        // 4. 표시 이름 설정 (영문 검색이어도 한국어 이름을 가져와서 표시)
        if (!koreanName) {
            const koNameData = await fetchPokemonNameKo(data.id);
            koreanName = koNameData.koreanName;
        }

        // 검색 결과를 저장할 때, Card 컴포넌트에서 name을 한국어 이름으로 덮어씁니다.
        setSearchResult({
            ...data,
            name: koreanName || data.name
        });

      } catch (err) {
        // API 요청 실패 또는 한국어 이름 변환 실패
        // 에러 메시지를 표시
        setError(`'${searchTerm}' (와)과 일치하는 포켓몬을 찾을 수 없습니다.`);
        setSearchResult(null);
      } finally {
        setLoading(false);
      }
    };
    // ------------------------------------

    const timerId = setTimeout(() => {
      performSearch();
    }, 500);

    return () => clearTimeout(timerId); 
  }, [searchTerm]);


  const renderContent = () => {
    if (loading) {
      return <LoadingSpinner />;
    }
    if (error) {
      return <Message style={{ color: 'red' }}>{error}</Message>;
    }
    if (searchResult) {
      return (
        <SearchGrid>
          <PokemonCard pokemon={searchResult} />
        </SearchGrid>
      );
    }
    if (searchTerm.trim() !== '') {
      return <Message>검색 중...</Message>;
    }
    return <Message>포켓몬 이름을 입력해주세요. (한글 또는 영문)</Message>;
  };


  return (
    <SearchContainer>
      <h2 style={{ textAlign: 'center', padding: '20px 0' }}>🔍 포켓몬 검색</h2>
      <SearchInput
        type="text"
        placeholder="포켓몬 이름 (예: 파이리, charizard)을 입력하세요"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      <ContentWrapper>
        {renderContent()}
      </ContentWrapper>
    </SearchContainer>
  );
};

export default Search;