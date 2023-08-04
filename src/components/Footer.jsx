import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const StyledFooter = styled.footer`
  display: flex;
  justify-content: space-between;

  padding: 0 16px;
  p {
    font-size: 14px;
    font-weight: 300;
    margin: 2rem 0 1rem;
  }
`;

const StyledButton = styled.button`
  padding: 0;
  border: 0;
  background: none;
  vertical-align: baseline;
  appearance: none;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  cursor: pointer;
  outline: 0;

  font-size: 14px;
  font-weight: 300;
  margin: 2rem 0 1rem;
  &:hover {
    text-decoration: underline;
  }
`;

const Footer = ({ numOfTodos }) => {
  //登出之後頁面跳轉到login頁面
  const navigate = useNavigate()


  //登入的話是localStorage會儲存token，那登出的話是localStorage裡的token要做移除
  const handleClick = () => {
    localStorage.removeItem('authToken');
    //登出之後頁面跳轉到login頁面
    navigate("/login")
  };
  return (
    <StyledFooter>
      <p>剩餘項目數： {numOfTodos}</p>
      <StyledButton onClick={handleClick}>登出</StyledButton>
    </StyledFooter>
  );
};

export default Footer;
