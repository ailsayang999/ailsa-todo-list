import {
  AuthContainer,
  AuthInputContainer,
  AuthButton,
  AuthLinkText,
} from 'components/common/auth.styled';
import { ACLogoIcon } from 'assets/images';
import { AuthInput } from 'components';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { checkPermission, register } from 'api/auth';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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

    const { success, authToken } = await register({
      username,
      email,
      password,
    });

    if (success) {
      localStorage.setItem('authToken', authToken);
      Swal.fire({
        position: 'top',
        title: '註冊成功！',
        timer: 1000,
        icon: 'success',
        showConfirmButton: false,
      });

      //在註冊成功後頁面navigate到todo頁面
      navigate('/todo');

      return;
    }
    Swal.fire({
      position: 'top',
      title: '註冊失敗！',
      timer: 1000,
      icon: 'error',
      showConfirmButton: false,
    });
  };

  // 要把驗證每一頁的token是否為有效的function，放到這個頁面上
  useEffect(() => {
    const checkTokenIsValid = async () => {
      // 去localStorage取 authToken
      const authToken = localStorage.getItem('authToken');
      // 如果authToken不存在的話（比如說登出的時後）代表它就是一個為驗證未登入的狀態
      if (!authToken) {
        // 如果authToken不存在，對於SignUp頁面，只要return，停留在當前頁面就好
        return;
      }
      // 當我們的authToken是存在的話(使用者有登入的時候)，就把authToken給checkPermission檢查，他會回傳是否是有效的登入(會回傳response.data.success，那這邊success裡面可能是true或false，這個boolean會被放到result裡面)
      const result = await checkPermission(authToken);
      //如果這個authToken是有效的話，我們不應該停留在註冊頁面，要導引到todo頁面
      if (result) {
        navigate('/todo');
      }
    };
    //當就執行checkTokenIsValid
    checkTokenIsValid();
  }, [navigate]); //因為有用到navigate這個function，所以就把它放到useEffect的dependency上

  return (
    <AuthContainer>
      <div>
        <ACLogoIcon />
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
