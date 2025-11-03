import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components'; // ✨ css 임포트 추가
import { useSelector } from 'react-redux';

const Nav = styled.header`
  background-color: #e3350d;
  color: white;
  padding: 10px 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TopBar = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px 20px;
`;

const Title = styled(Link)`
  font-family: 'Press Start 2P', cursive; 
  font-size: 2.2em;
  font-weight: bold;
  letter-spacing: 2px;
  text-shadow: 3px 3px 0px #000;
  color: #ffde00;
  text-decoration: none;
`;

const BottomBar = styled.div`
  background-color: white;
  width: 100%;
  padding: 10px 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  max-width: 1200px;
  width: 100%;
  justify-content: flex-start;
`;

const NavLink = styled(Link)`
  font-weight: bold;
  font-size: 1.1em;
  padding: 8px 15px;
  border-radius: 8px;
  color: #333;
  transition: background-color 0.2s;

  &:hover {
    background-color: #eee;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  position: relative;
`;

const SearchIcon = styled.span`
  font-size: 1.5em;
  color: #555;
  cursor: pointer;
  padding: 5px;
  transition: color 0.2s;
  &:hover {
    color: #e3350d;
  }
`;

// 검색창 팝업 스타일 (✨ 수정)
const SearchInputPopup = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 10px;
  z-index: 1000;
  
  /* ✨ DOM 노드는 유지하고, CSS로만 숨김/표시를 제어 */
  ${props => !props.$isopen && css`
    display: none;
  `}
`;

const InputField = styled.input`
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 5px;
  font-size: 1em;
`;

const FavoriteCount = styled.span`
  background-color: #ffde00;
  color: #333;
  padding: 2px 8px;
  border-radius: 12px;
  margin-left: 5px;
  font-size: 0.9em;
`;


const Header = () => {
  const favoriteCount = useSelector(state => state.favorite.favorites.length);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 메인 페이지로 이동하며 'search' 쿼리 파라미터를 사용하여 필터링
      navigate(`/?search=${searchQuery.toLowerCase().trim()}`); // ✨ trim() 추가
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  return (
    <Nav>
      <TopBar>
        <Title to="/">포켓몬 도감</Title>
      </TopBar>
      <BottomBar>
        <NavLinks>
          <NavLink to="/">메인</NavLink>
          <NavLink to="/favorites">
            찜목록
            <FavoriteCount>{favoriteCount}</FavoriteCount>
          </NavLink>
          <SearchContainer>
            <SearchIcon onClick={() => setIsSearchOpen(!isSearchOpen)}>
              🔍
            </SearchIcon>
            {/* 💡 수정된 부분: 조건부 렌더링 제거. 항상 렌더링하고 props로 숨김 */}
            <SearchInputPopup $isopen={isSearchOpen}> 
                <form onSubmit={handleSearchSubmit}>
                    <InputField
                        type="text"
                        placeholder="포켓몬 이름 (한글/영문) 검색..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        // isSearchOpen일 때만 autoFocus 활성화
                        autoFocus={isSearchOpen} 
                    />
                </form>
            </SearchInputPopup>
          </SearchContainer>
        </NavLinks>
      </BottomBar>
    </Nav>
  );
};

export default Header;