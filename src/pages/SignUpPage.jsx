import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
// import { ACLogoIcon } from 'assets/images';
import { SiTodoist } from 'react-icons/si';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'contexts/AuthContext';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const { register, isAuthenticated } = useAuth();

  const handleClick = async () => {
    if (username.length === 0) {
      return;
    }
    if (password.length === 0) {
      return;
    }
    if (email.length === 0) {
      return;
    }

    const success = await register({
      username,
      email,
      password,
    });

    //註冊成功：從後端回傳回來的 success 是 true，用success的值去顯示我們的提示訊息
    if (success) {
      Swal.fire({
        position: 'top',
        title: '註冊成功！',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
      });
      return;
    }
    //註冊失敗
    Swal.fire({
      position: 'top',
      title: '註冊失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
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
        <SiTodoist style={{ color: 'ff6601', fontSize: '37px' }} />
      </div>
      <h1>建立您的帳號</h1>

      <AuthInputContainer>
        <AuthInput
          label={'帳號'}
          placeholder={'請輸入帳號'}
          value={username}
          onChange={(nameInputValue) => setUsername(nameInputValue)}
        />
      </AuthInputContainer>

      <AuthInputContainer>
        <AuthInput
          label={'Email'}
          placeholder={'請輸入email'}
          value={email}
          onChange={(emailInputValue) => setEmail(emailInputValue)}
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
      <AuthButton onClick={handleClick}>註冊</AuthButton>
      <Link to="/login">
        <AuthLinkText>取消</AuthLinkText>
      </Link>
    </AuthContainer>
  );
};

export default SignUpPage;
