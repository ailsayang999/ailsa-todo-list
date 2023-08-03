import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { login } from 'api/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
      //用解構去把success和authToken的值從return回來的data中取出來
      const { success, authToken } = await login({
        username,
        password,
      });

      //登入成功
      if (success) {
        //通常我們會把我們的authToken存在localStorage
        localStorage.setItem('authToken', authToken);
        // 登入成功訊息
        Swal.fire({
          position: 'top',
          title: '登入成功！',
          timer: 1000,
          icon: 'success',
          showConfirmButton: false,
        });

        //在登入成功後頁面navigate到todo頁面
        navigate('/todo');

        return;
      }

      // 登入失敗訊息
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

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
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
