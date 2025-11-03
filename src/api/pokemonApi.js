import axios from 'axios';

const API_BASE_URL = 'https://pokeapi.co/api/v2';

// 한국어 이름 캐시를 위한 전역 변수 (메모리 사용)
let pokemonKoNameCache = [];

// 1. 초기 목록 가져오기 
export const fetchInitialPokemonList = async (limit = 151) => {
  const response = await axios.get(`${API_BASE_URL}/pokemon?limit=${limit}`);
  return response.data.results;
};

// 2. 포켓몬 상세 정보 가져오기 (URL 배열을 받아 Promise.all 처리)
export const fetchPokemonDetails = async (pokemonUrls) => {
  const detailPromises = pokemonUrls.map(url => axios.get(url));
  const detailedResponses = await Promise.all(detailPromises);
  return detailedResponses.map(res => res.data);
};

// 3. 단일 포켓몬 상세 정보 가져오기
export const fetchSinglePokemon = async (identifier) => {
  const response = await axios.get(`${API_BASE_URL}/pokemon/${identifier}`);
  return response.data;
};

// ✨ 4. 새로운 함수: 포켓몬의 한국어 이름 캐시 및 매핑
export const fetchPokemonNameKo = async (idOrName) => {
  try {
    const speciesResponse = await axios.get(`${API_BASE_URL}/pokemon-species/${idOrName}`);
    const names = speciesResponse.data.names;
    
    const koreanNameEntry = names.find(name => name.language.name === 'ko');
    const englishName = speciesResponse.data.name; 
    
    return {
        koreanName: koreanNameEntry ? koreanNameEntry.name : englishName,
        englishName: englishName,
        id: speciesResponse.data.id
    };

  } catch (error) {
    throw new Error('Pokemon species data not found.');
  }
};

// 5. 모든 포켓몬의 한국어 이름을 미리 로드하여 캐시합니다.
export const loadAllPokemonKoNames = async (limit = 151) => {
  if (pokemonKoNameCache.length === limit) {
    return pokemonKoNameCache;
  }
  
  console.log("한국어 이름 데이터 로드 시작...");
  const promises = [];
  for (let i = 1; i <= limit; i++) {
    promises.push(fetchPokemonNameKo(i));
  }
  
  const results = await Promise.all(promises);
  
  // 캐시에 저장: { id: 1, koreanName: '이상해씨', englishName: 'bulbasaur' }
  pokemonKoNameCache = results.map(res => ({
    id: res.id,
    koreanName: res.koreanName,
    englishName: res.englishName,
    searchableName: res.koreanName.toLowerCase().trim() // 검색을 위한 키
  }));

  console.log("한국어 이름 데이터 로드 완료:", pokemonKoNameCache.length);
  return pokemonKoNameCache;
};

// 6. 캐시된 이름 데이터에 접근하는 함수
export const getKoNameCache = () => pokemonKoNameCache;