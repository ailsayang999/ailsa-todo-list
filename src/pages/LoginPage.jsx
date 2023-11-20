import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
//import { ACLogoIcon } from 'assets/images';
import { SiTodoist } from 'react-icons/si';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const LoginPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { login, isAuthenticated } = useAuth();

  //handle點擊登入按鈕時的event，在點擊登入的button時會去呼叫handleClick這個function，handleClick這個function會再去呼叫auth.js裡面的login非同步function
  const handleClick = async () => {
    //防止使用者沒有輸入username和password
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    try {
      //用AuthContext裡面的非同步login函式，可以拿到success的布林值
      const success = await login({
        username,
        password,
      });

      //登入成功：從後端回傳回來的 success 是 true，用success的值去顯示我們的提示訊息
      if (success) {
        // 登入成功訊息
        Swal.fire({
          position: 'top',
          title: '登入成功！',
          timer: 1000,
          icon: 'success',
          showConfirmButton: false,
        });
        return;
      }
      //登入失敗
      Swal.fire({
        position: 'top',
        title: '登入失敗！',
        timer: 1000,
        icon: 'error',
        showConfirmButton: false,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // 我只要去check每個頁面的isAuthenticated的true或是false，來做切換頁面的動作
  useEffect(() => {
    //  驗證有成功的話
    if (isAuthenticated) {
      // 頁面跳轉到todo頁面
      navigate('/todos');
    }
    //那如果isAuthenticated不為true的話就不做任何頁面套轉的動作
  }, [navigate, isAuthenticated]); //因為有用到navigate這個function和isAuthenticated，所以就把它放到useEffect的dependency上

  return (
    <AuthContainer>
      <div>
        <SiTodoist style={{ color: 'skyblue', fontSize: '37px' }} />
      </div>
      <h1>登入 Todo</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          placeholder={'請輸入帳號'}
          value={username}
          onChange={(nameInputValue) => setUserName(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          type={'password'}
          label={'密碼'}
          placeholder={'請輸入密碼'}
          value={password}
          onChange={(passwordInputValue) => setPassword(passwordInputValue)}
        />
      </AuthInputContainer>

      <AuthButton onClick={handleClick}>登入</AuthButton>
      <Link to="/signup">
        <AuthLinkText>註冊</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default LoginPage;
