import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';



function App() {
  return (
    <BrowserRouter>
      {/* 
        For Dev 2 mocks: Route splitting 
        - '/' goes to Login page (outside the Sidebar layout)
        - '/login' goes to Login page
        - Everything else goes into the Layout shell
      */}
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
