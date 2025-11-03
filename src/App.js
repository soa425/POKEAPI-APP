import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import LoadingSpinner from './components/common/LoadingSpinner';

// 최적화: Lazy Loading 적용
const LazyMain = lazy(() => import('./pages/Main'));
const LazyDetail = lazy(() => import('./pages/Detail'));
const LazyFavorite = lazy(() => import('./pages/Favorite'));
// Search 라우트는 Main에 통합되었으므로 제거

function App() {
  return (
    <Router>
      <Header />
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<LazyMain />} />
          <Route path="/pokemon/:id" element={<LazyDetail />} />
          <Route path="/favorites" element={<LazyFavorite />} />
          {/* /search 라우트 제거 */}
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;