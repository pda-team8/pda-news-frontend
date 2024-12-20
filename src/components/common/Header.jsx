import { useState } from 'react';

import { Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';

// import useAuth from '~/lib/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'; // useSelector를 추가하여 Redux 상태를 가져옴
import { logout } from '~/store/authSlice'; // 로그아웃 액션을 가져옴
import { OnLoginModal, OnSignupModal } from '~/store/modalSlice';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
export default function MyNavbar({ brandTitle, offCanvasTitle }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태에서 로그인 상태와 사용자 정보를 가져옴
  const { isLoggedIn, user } = useSelector((state) => state.auth);

  // 로그아웃 버튼 클릭 시
  const handleLogout = () => {
    fetch(`${API_BASE_URL}/api/users/api/v1/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    })
      .then((resp) => {
        return resp.json;
      })
      .then((data) => {
        console.log(data);
      });
    sessionStorage.clear();
    dispatch(logout()); // 로그아웃 액션 dispatch
    navigate('/'); // 메인 페이지로 이동
  };

  const mainButton = () => {
    navigate(`/`);
  };

  const myPageBtn = () => {
    navigate(`/mypage`);
  };
  // login modal창 열기
  const OpenLoginModal = () => {
    dispatch(OnLoginModal());
  };
  const OpenSignupModal = () => {
    dispatch(OnSignupModal());
  };

  return (
    <Navbar expand="lg" className="bg-body-tertiary" style={{ padding: '0' }}>
      <Container fluid style={{ background: '#F5F5F5', height: '60px' }}>
        <Navbar.Brand
          href="#"
          style={{ fontWeight: 'bold' }}
          onClick={mainButton}
        >
          <h2 style={{ marginLeft: '20px' }}>
            <span style={{ fontSize: '20px' }}>
              <b>Economy&nbsp;</b>
            </span>
            <span style={{ color: '#E34348', fontSize: '20px' }}>
              <b>News</b>
            </span>
          </h2>
          {/* <h2 style={{ color: '#E34348' }}><b>News</b></h2> */}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll></Nav>
          <Nav
            title={isLoggedIn ? '' : 'Login'} // 로그인했으면 이메일, 아니면 'Login' 버튼
            id="navbarScrollingDropdown"
            align="end"
            style={{ marginLeft: '30px', marginRight: '20px' }}
          >
            {isLoggedIn ? (
              <>
                <NavDropdown
                  title={isLoggedIn ? `${user?.username}님` : user?.email}
                  id="navbarScrollingDropdown"
                  align="end"
                  // style={{ marginLeft: '30px', marginRight: '20px' }}
                >
                  <NavDropdown.Item onClick={myPageBtn}>
                    Mypage
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#policy">
                    Economic Policy
                  </NavDropdown.Item>
                  {/* <NavDropdown.Item href="#company">Companies</NavDropdown.Item>
                  <NavDropdown.Item href="#finance">Finance</NavDropdown.Item>
                  <NavDropdown.Item href="#global">Global</NavDropdown.Item> */}
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>{' '}
                  {/* 로그아웃 버튼 */}
                </NavDropdown>
              </>
            ) : (
              <div style={{ display: 'flex', gap: '25px' }}>
                <NavDropdown.Item onClick={OpenSignupModal}>
                  Sign up
                </NavDropdown.Item>{' '}
                <NavDropdown.Item onClick={OpenLoginModal}>
                  Login
                </NavDropdown.Item>{' '}
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
