import axios from 'axios';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import { useNavigate } from 'react-router';
import defaultImage from '../../assets/image.svg';
import SearchBar from '~/components/search/searchbar';
import Modal from 'react-bootstrap/Modal';
import { OffLoginModal, OffSignupModal } from '~/store/modalSlice';
import Login from '../loginPage/login';
import Signup from '../signupPage/signup';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function NewsCard({
  id,
  image = defaultImage,
  title = '제목 없음',
  date = '날짜 없음',
  content = '내용이 없습니다.',
}) {
  const navigate = useNavigate();

  async function newsDetail() {
    navigate(`/detail/${id}`);
    console.log(id);
  }

  return (
    <Card
      onClick={newsDetail}
      style={{
        width: 'calc(23% - 20px)',
        margin: '10px',
        cursor: 'pointer',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        borderRadius: '10px',
      }}
    >
      <Card.Img
        variant="top"
        src={image}
        style={{
          height: '150px',
          objectFit: 'cover',
          borderTopLeftRadius: '10px',
          borderTopRightRadius: '10px',
        }}
      />
      <Card.Body style={{ padding: '10px' }}>
        <Card.Title
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '5px',
          }}
        >
          {title}
        </Card.Title>
        <Card.Subtitle
          className="mb-2 text-muted"
          style={{ fontSize: '12px', color: '#aaa', marginTop: '10px' }}
        >
          {date}
        </Card.Subtitle>
        <Card.Text
          style={{
            fontSize: '12px',
            color: '#555',
            lineHeight: '1.5',
            marginTop: '5px',
          }}
        >
          {content}...
        </Card.Text>
      </Card.Body>
    </Card>
  );
}

NewsCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
};

function formatDate(isDate) {
  const date = new Date(isDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}년 ${month}월 ${day}일`;
}

export default function MainPage() {
  const [newsList, setNewsList] = useState([]);
  const { isLoginModal, isSignupModal } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  // login modal창 닫기
  const CloseLoginModal = () => {
    dispatch(OffLoginModal());
  };
  // signup modal창 닫기
  const CloseSignupModal = () => {
    dispatch(OffSignupModal());
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/news/main`) // 백틱(`)으로 템플릿 리터럴 사용
      .then((response) => {
        setNewsList(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div style={{ backgroundColor: '#FBFBFB' }}>
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '60px',
        }}
      >
        <h2>
          <b>Economy&nbsp;</b>
        </h2>
        <h2 style={{ color: '#E34348' }}>
          <b>News</b>
        </h2>
      </Container>

      {/* SearchBar 컴포넌트를 여기에 추가 */}
      <Container
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          paddingBottom: '60px',
        }}
      >
        <SearchBar />
      </Container>

      <Container
        className="d-flex flex-wrap justify-content-start"
        style={{ display: 'flex', gap: '20px', padding: '0 12px' }}
      >
        {newsList.map((news) => (
          <NewsCard
            key={news.id}
            id={news.id}
            title={news.title}
            image={news.imageURL}
            content={news.preview}
            date={formatDate(news.published_at)}
          />
        ))}
      </Container>

      {/* 로그인 모달 */}
      <Modal show={isLoginModal} onHide={CloseLoginModal} centered>
        <Modal.Header
          style={{ borderBottom: 'none' }}
          closeButton
        ></Modal.Header>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Login />
        </div>
        <Modal.Footer
          style={{ padding: '19px', borderTop: 'none' }}
        ></Modal.Footer>
      </Modal>

      {/* 회원가입 모달 */}
      <Modal show={isSignupModal} onHide={CloseSignupModal} centered>
        <Modal.Header
          style={{ borderBottom: 'none' }}
          closeButton
        ></Modal.Header>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Signup />
        </div>
        <Modal.Footer
          style={{ padding: '19px', borderTop: 'none' }}
        ></Modal.Footer>
      </Modal>
    </div>
  );
}
