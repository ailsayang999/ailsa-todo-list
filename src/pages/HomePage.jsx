import { useAuth } from 'contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    //如果有驗證成功，直接到todo頁面
    if (isAuthenticated) {
      navigate('/todo');
    } else {
      //如果還沒驗證成功，直接到login頁面
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);
};

export default HomePage;
