import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { livesAPI, progressAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { Settings, User, Eye, EyeOff } from 'lucide-react';
import HoneycombDecoration from '../components/HoneycombDecoration';
import toast from 'react-hot-toast';
import './Dashboard.css';
// Изображения из public папки доступны через абсолютные пути
const mascotImage = '/mascot.png';
const mascotV10Image = '/mascot-v10.png';
const mascotV16Image = '/mascot-v16.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [lives, setLives] = useState(null);
  const [loading, setLoading] = useState(true);
  // Прогресс тем из API - хуки должны быть объявлены до любого условного возврата
  const [jobProgress, setJobProgress] = useState({ current: 0, total: 11, percent: 0 });
  const [rentProgress, setRentProgress] = useState({ current: 0, total: 11, percent: 0 });
  const navigate = useNavigate();
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const fetchLives = async () => {
    try {
      const response = await livesAPI.getMyLives();
      setLives(response.data);
    } catch (error) {
      console.error('Ошибка загрузки жизней:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopicsProgress = async () => {
    try {
      const [jobRes, rentRes] = await Promise.all([
        progressAPI.getByTopic('job'),
        progressAPI.getByTopic('rent'),
      ]);

      const calc = (items, topic) => {
        // Для rent есть 5 уроков (1, 2, 3, 4, 5), для job пока нет уроков
        const total = topic === 'rent' ? 5 : 0;
        const current = items?.data?.items?.filter(i => i.status === 'completed').length || 0;
        const percent = total > 0 ? (current / total) * 100 : 0;
        return { current, total, percent };
      };
      setJobProgress(calc(jobRes, 'job'));
      setRentProgress(calc(rentRes, 'rent'));
    } catch (e) {
      console.warn('Не удалось загрузить прогресс тем');
    }
  };

  useEffect(() => {
    fetchLives();
    // Подгружаем прогресс тем для прогресс-баров
    fetchTopicsProgress();
  }, []);

  const handleStartCourse = () => {
    if (!user) {
      // Если пользователь не авторизован, показываем форму регистрации
      setShowRegisterModal(true);
    } else {
      // Если авторизован, переходим к курсам
      if (lives?.current_lives <= 0) {
        alert('У вас закончились жизни!');
        return;
      }
      navigate('/courses');
    }
  };

  const handleHaveAccount = () => {
    setShowRegisterModal(false);
    setShowLoginModal(true);
  };

  const handleSwitchToRegister = () => {
    setShowLoginModal(false);
    setShowRegisterModal(true);
  };

  const handleCloseModals = () => {
    setShowRegisterModal(false);
    setShowLoginModal(false);
  };

  if (loading) {
    return (
      <div className="dashboard-main">
        <div className="dashboard-container">
          <div style={{ padding: '100px 20px', textAlign: 'center' }}>
            Загрузка...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-inner">
        {/* Шапка */}
        <div className="dashboard-header">
          {/* Футер (верхняя панель) */}
          <div className="header-footer">
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="header-logo">ЛОГОТИП</div>
            </Link>
            <nav className="header-nav">
              <span className="header-nav-link" style={{ cursor: 'not-allowed', opacity: 0.5 }}>Задания</span>
              <span className="header-nav-link" style={{ cursor: 'not-allowed', opacity: 0.5 }}>Магазин</span>
            </nav>
            <div className="header-social-links">
              <span className="header-social-icon" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                <Settings size={32} color="#000000" />
              </span>
              <span className="header-social-icon" style={{ cursor: 'not-allowed', opacity: 0.5 }}>
                <User size={32} color="#000000" />
              </span>
            </div>
          </div>
          {/* Декоративные полигоны: используем HoneycombDecoration как в Login */}
          <div className="honeycomb-layer">
            <HoneycombDecoration />
          </div>

          {/* Изображение талисмана */}
          <div className="header-image-container">
            <img 
              src={mascotImage} 
              alt="Талисман" 
              className="header-image"
              style={{ transform: 'translateY(-162px) translateX(135px)' }}
            />
          </div>

          {/* Контент шапки */}
          <div className="header-content">
            <h1 className="header-title">Как быть взрослым?</h1>
            <p className="header-description">
              <p>Где и как снимать жильё?</p> 
              <p>Что такое резюме и как пройти собеседование?</p>
              <p>На наших уроках ты узнаешь как пройти квест под названием взрослая жизнь и не сойти с ума</p>
            </p>
            {!user && (
              <div className="header-buttons">
                <button 
                  className="btn-primary-dashboard"
                  onClick={handleStartCourse}
                >
                  НАЧАТЬ
                </button>
                <button 
                  className="btn-secondary-dashboard"
                  onClick={handleHaveAccount}
                >
                  У МЕНЯ ЕСТЬ АККАУНТ
                </button>
              </div>
            )}
          </div>

          {/* Футер в шапке */}
          <div className="header-footer">
            <Link to="/dashboard" style={{ textDecoration: 'none' }}>
              <div className="header-logo">ЛОГОТИП</div>
            </Link>
            <nav className="header-nav">
              <a href="/dashboard" className="header-nav-link">Задания</a>
              <a href="/shop" className="header-nav-link">Магазин</a>
            </nav>
            <div className="header-social-links">
              <a href="/settings" className="header-social-icon">
                <Settings size={32} color="#000000" />
              </a>
              <a href="/profile" className="header-social-icon">
                <User size={32} color="#000000" />
              </a>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="dashboard-content">
          {/* Заголовок секции */}
          <h2 className="section-title-main">На наших уроках ты узнаешь</h2>

          {/* Блок 1: Квартира (картинка слева, карточка справа) */}
          <div className="lesson-row">
            <div className="lesson-illustration">
              <img src={mascotV10Image} alt="Пчёлка - квартира" className="lesson-image" />
            </div>
            <div className="course-card right no-top-gap" >
              <div 
              className="course-card-icon"
              onClick={() => navigate('/topic/rent')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/topic/rent');
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.5507 32.5613L32.4938 19.0733M32.4938 19.0733L19.0338 19.1304M32.4938 19.0733L19.0907 32.6184M42.5461 8.91452C51.8776 18.1866 51.9414 33.2836 42.6885 42.6345C33.4356 51.9854 18.3699 52.0493 9.03843 42.7772C-0.293096 33.5051 -0.356842 18.4081 8.89604 9.0572C18.1489 -0.293709 33.2146 -0.357587 42.5461 8.91452Z" stroke="#C97200" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="course-card-title">Как снять квартиру?</h3>
              <p className="course-card-description">
                Узнай как найти подходящее жильё, как проверить договор аренды,
                как вести переговоры с арендодателем и не попасться на мошенников
              </p>
              {user && (
                <div 
                className="progress-group"
                  
              onClick={() => navigate('/topic/rent')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/topic/rent');
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
                  >
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${rentProgress.percent}%` }}></div>
                    <div className="progress-text">{`${rentProgress.current}/${rentProgress.total}`}</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Пробел между блоками */}
          <div style={{ height: 80 }} />

          {/* Блок 2: Работа (карточка слева, картинка справа) */}
          <div className="lesson-row reverse">
            <div className="lesson-illustration">
              <img src={mascotV16Image} alt="Пчёлка - работа" className="lesson-image" />
            </div>
            <div className="course-card">
              <div 
              className="course-card-icon"
              
              onClick={() => navigate('/topic/job')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/topic/job');
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              >
                <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M32.5507 32.5613L32.4938 19.0733M32.4938 19.0733L19.0338 19.1304M32.4938 19.0733L19.0907 32.6184M42.5461 8.91452C51.8776 18.1866 51.9414 33.2836 42.6885 42.6345C33.4356 51.9854 18.3699 52.0493 9.03843 42.7772C-0.293096 33.5051 -0.356842 18.4081 8.89604 9.0572C18.1489 -0.293709 33.2146 -0.357587 42.5461 8.91452Z" stroke="#C97200" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="course-card-title">Как найти работу?</h3>
              <p className="course-card-description">
                На наших уроках ты узнаешь как правильно составить резюме,
                как подготовиться к собеседованию и как найти работу своей мечты
              </p>
              {user && (
                <div 
                className="progress-group"
                
              onClick={() => navigate('/topic/job')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/topic/job');
                }
              }}
              role="button"
              tabIndex={0}
              style={{ cursor: 'pointer' }}
              >
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${jobProgress.percent}%` }}></div>
                    <div className="progress-text">{`${jobProgress.current}/${jobProgress.total}`}</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Футер внизу */}
        <div className="dashboard-footer">
          <div className="dashboard-footer-content">
            <div className="footer-logo">ЛОГОТИП</div>
          </div>
        </div>
        </div>
      </div>

      {/* Модальные окна */}
      {(showRegisterModal || showLoginModal) && (
        <>
          <div className="modal-backdrop" onClick={handleCloseModals}></div>
          {showRegisterModal && (
            <RegisterModal onClose={handleCloseModals} onSwitchToLogin={handleHaveAccount} />
          )}
          {showLoginModal && (
            <LoginModal onClose={handleCloseModals} onSwitchToRegister={handleSwitchToRegister} />
          )}
        </>
      )}
    </div>
  );
};

// Модальное окно регистрации - используем компонент Register
const RegisterModal = ({ onClose, onSwitchToLogin }) => {
  return (
    <div className="modal-container register-modal">
      <div className="login-page register-page">
        <div className="login-container">
          <button className="modal-close-button" onClick={onClose}>×</button>
          <RegisterFormModal onClose={onClose} onSwitchToLogin={onSwitchToLogin} />
        </div>
      </div>
    </div>
  );
};

// Внутренний компонент формы регистрации
const RegisterFormModal = ({ onClose, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    full_name: '',
    username: '',
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password.length < 6) {
      toast.error('Пароль должен содержать минимум 6 символов');
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      toast.success('Регистрация успешна!');
      onClose();
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      {/* Левая часть с декоративными элементами */}
      <div className="login-decoration">
        <div className="honeycomb-layer">
          <HoneycombDecoration />
        </div>
        <div className="mascot-layer">
          <img 
            src="/mascot.png" 
            alt="Mascot" 
            className="mascot-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      {/* Правая часть с формой */}
      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <label htmlFor="full_name" className="input-label">
              Имя пользователя
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваше имя"
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="username" className="input-label">
              Никнейм
            </label>
            <div className="input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваш никнейм"
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="password" className="input-label">
              Пароль
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваш пароль"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={24} />
                ) : (
                  <Eye size={24} />
                )}
              </button>
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </div>

          <div className="register-link-wrapper">
            <button
              type="button"
              className="register-link"
              onClick={onSwitchToLogin}
            >
              Войти
            </button>
          </div>

          <div className="social-icons">
            <button type="button" className="social-icon" aria-label="Google">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 13C0 5.82071 5.82071 0 13 0C16.4266 0 19.5338 1.33661 21.8526 3.49765C22.0511 3.68263 22.1659 3.94032 22.1706 4.2116C22.1754 4.48288 22.0698 4.74445 21.8779 4.93631L18.4837 8.33051C18.1092 8.70501 17.5077 8.72257 17.112 8.37056C16.0144 7.3942 14.5783 6.8 13 6.8C9.57609 6.8 6.8 9.57609 6.8 13C6.8 16.4239 9.57609 19.2 13 19.2C15.1651 19.2 17.0695 18.087 18.1771 16.4H13C12.4477 16.4 12 15.9523 12 15.4V10.6C12 10.0477 12.4477 9.6 13 9.6H24.7666C25.244 9.6 25.6548 9.9374 25.7475 10.4057C25.9109 11.2303 26 12.1306 26 13C26 20.1793 20.1793 26 13 26C5.82071 26 0 20.1793 0 13ZM13 2C6.92528 2 2 6.92528 2 13C2 19.0747 6.92528 24 13 24C19.0747 24 24 19.0747 24 13C24 12.5366 23.97 12.0614 23.9137 11.6H14V14.4H19.7818C20.1065 14.4 20.411 14.5577 20.5984 14.8228C20.7858 15.088 20.8328 15.4277 20.7245 15.7338C19.5988 18.9128 16.5726 21.2 13 21.2C8.47152 21.2 4.8 17.5285 4.8 13C4.8 8.47152 8.47152 4.8 13 4.8C14.751 4.8 16.3696 5.35359 17.6982 6.28761L19.6972 4.28859C17.8407 2.8555 15.5223 2 13 2Z" fill="black"/>
              </svg>
            </button>
            <button type="button" className="social-icon" aria-label="VK">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.8733 16.1533C30.1481 14.6926 29.1925 13.3584 28.0433 12.2017C27.6523 11.7471 27.1937 11.2984 26.8357 10.9482L26.7857 10.8993C26.6011 10.7186 26.4485 10.5686 26.3237 10.4393C27.8951 8.25432 29.2399 5.9146 30.3373 3.4563L30.3816 3.35711L30.4126 3.25302C30.5569 2.76916 30.7229 1.84907 30.1353 1.01756C29.528 0.158119 28.5554 0.00312288 27.9043 0.00312288H24.9082C24.2835 -0.0255126 23.6651 0.143342 23.141 0.486639C22.6131 0.832527 22.2092 1.33704 21.987 1.9268C21.3417 3.46372 20.5343 4.9256 19.5796 6.28797V2.77692C19.5796 2.32307 19.5369 1.56386 19.0509 0.923055C18.4691 0.155805 17.6276 0.00312288 17.0435 0.00312288H12.2894C11.677 -0.011043 11.0813 0.207966 10.6235 0.616786C10.1547 1.03546 9.86735 1.62028 9.8225 2.24724L9.81825 2.30663V2.36618C9.81825 3.01348 10.0747 3.49096 10.2797 3.79125C10.3714 3.9257 10.4695 4.04808 10.5315 4.12538L10.5458 4.14322C10.6119 4.22564 10.6561 4.28065 10.7003 4.34088C10.8168 4.49931 10.9843 4.74357 11.0317 5.37565V7.3396C10.2121 5.99231 9.34755 4.19942 8.69701 2.28458L8.68703 2.2552L8.67596 2.22621C8.51375 1.80138 8.25359 1.18324 7.73255 0.710219C7.12384 0.157616 6.40386 0.00312288 5.74909 0.00312288H2.70916C2.04675 0.00312288 1.24818 0.158088 0.652315 0.786658C0.066364 1.40477 0 2.14542 0 2.53923V2.71674L0.0373851 2.89026C0.879392 6.79841 2.61435 10.4582 5.10595 13.5835C6.23557 15.365 7.76624 16.8582 9.57617 17.9434C11.415 19.0459 13.4894 19.6959 15.6286 19.8396L15.6845 19.8434H15.7404C16.7082 19.8434 17.7171 19.7598 18.4757 19.2543C19.4992 18.5723 19.5796 17.5248 19.5796 17.0029V15.4856C19.8422 15.6979 20.1681 15.9837 20.5671 16.3678C21.0493 16.8506 21.4333 17.2688 21.7627 17.6339L21.9384 17.8293L21.9395 17.8304C22.1952 18.1152 22.447 18.3955 22.6762 18.626C22.9643 18.9157 23.3195 19.2348 23.766 19.4706C24.2495 19.7259 24.7569 19.8413 25.2959 19.8413H28.3379C28.9788 19.8413 29.898 19.6897 30.5442 18.9405C31.2486 18.124 31.1947 17.1232 30.9733 16.404L30.9335 16.2746L30.8733 16.1533ZM23.2477 16.2942C22.9052 15.9145 22.4922 15.4646 21.9705 14.9428L21.9661 14.9385C20.158 13.1953 19.3131 12.8915 18.7157 12.8915C18.398 12.8915 18.0464 12.9271 17.8183 13.2114C17.7106 13.3455 17.654 13.5073 17.6223 13.676C17.5906 13.8444 17.5796 14.0421 17.5796 14.2673V17.0029C17.5796 17.3426 17.5238 17.4852 17.3666 17.59C17.1573 17.7294 16.71 17.8425 15.7516 17.8434C13.9324 17.7193 12.1686 17.1658 10.6047 16.2281C9.03756 15.2885 7.71611 13.99 6.74916 12.4396L6.73864 12.4227L6.72618 12.4072C4.4045 9.51751 2.7867 6.12762 2.0004 2.50546C2.00466 2.33085 2.0425 2.22726 2.10379 2.16261C2.16695 2.09598 2.31998 2.00312 2.70916 2.00312H5.74909C6.08726 2.00312 6.26227 2.07668 6.38822 2.19103C6.53102 2.32066 6.65487 2.54081 6.80534 2.9339C7.55149 5.12853 8.56051 7.1809 9.516 8.69002C9.99358 9.44431 10.4636 10.0721 10.8871 10.5158C11.0984 10.7373 11.3058 10.9208 11.5036 11.0513C11.6951 11.1776 11.9122 11.2772 12.1354 11.2772C12.2532 11.2772 12.391 11.2651 12.5237 11.2063C12.6664 11.1431 12.7772 11.0378 12.8554 10.8967C12.9938 10.6471 13.0317 10.2773 13.0317 9.79294V5.30799L13.0311 5.29747C12.9619 4.20634 12.6325 3.59258 12.3117 3.15624C12.2414 3.06062 12.1721 2.97424 12.1115 2.89866L12.0948 2.87794C12.0282 2.79488 11.9752 2.72776 11.9317 2.66393C11.8519 2.54699 11.8209 2.46545 11.8184 2.37808C11.8288 2.27437 11.8777 2.17814 11.9557 2.10852C12.0366 2.03625 12.1425 1.99863 12.2509 2.00312H17.0435C17.3183 2.00312 17.4108 2.07016 17.4574 2.13157C17.5231 2.21827 17.5796 2.39857 17.5796 2.77692V8.81507C17.5796 9.53232 17.9102 10.0178 18.3904 10.0178C18.9429 10.0178 19.3412 9.6826 20.0377 8.98614L20.0493 8.97451L20.0597 8.9618C21.6208 7.05808 22.8966 4.93731 23.8463 2.66591L23.8523 2.64888C23.9237 2.44817 24.0588 2.27634 24.237 2.1596C24.4152 2.04286 24.6267 1.98763 24.8393 2.00233L24.8507 2.00312H27.9043C28.3207 2.00312 28.4577 2.10911 28.502 2.17178C28.5491 2.23847 28.5819 2.38139 28.5018 2.66167C27.407 5.11021 26.0532 7.43439 24.464 9.59515L24.454 9.61046C24.2997 9.84637 24.1305 10.1074 24.106 10.4072C24.0797 10.7291 24.219 11.0217 24.4627 11.3353C24.6403 11.5979 25.0066 11.9564 25.3781 12.3202L25.4132 12.3544C25.8028 12.7358 26.2248 13.1488 26.5637 13.5487L26.5727 13.5594L26.5826 13.5693C27.5926 14.5767 28.4324 15.7413 29.0694 17.0176C29.171 17.3651 29.1088 17.5427 29.0298 17.6343C28.9373 17.7415 28.7302 17.8413 28.3379 17.8413H25.2959C25.0585 17.8413 24.875 17.7945 24.6999 17.702C24.5173 17.6056 24.3296 17.4522 24.0941 17.2155C23.9045 17.0249 23.6973 16.7943 23.4446 16.513C23.3819 16.4433 23.3163 16.3703 23.2477 16.2942Z" fill="black"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// Модальное окно логина - используем компонент Login
const LoginModal = ({ onClose, onSwitchToRegister }) => {
  return (
    <div className="modal-container login-modal">
      <div className="login-page">
        <div className="login-container">
          <button className="modal-close-button" onClick={onClose}>×</button>
          <LoginFormModal onClose={onClose} onSwitchToRegister={onSwitchToRegister} />
        </div>
      </div>
    </div>
  );
};

// Внутренний компонент формы логина
const LoginFormModal = ({ onClose, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      toast.success('Успешный вход!');
      onClose();
      navigate('/dashboard');
    } else {
      toast.error(result.error);
    }
    
    setLoading(false);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <>
      <div className="login-decoration">
        <div className="honeycomb-layer">
          <HoneycombDecoration />
        </div>
        <div className="mascot-layer">
          <img 
            src="/mascot.png" 
            alt="Mascot" 
            className="mascot-image"
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        </div>
      </div>

      <div className="login-form-wrapper">
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-field">
            <label htmlFor="email" className="input-label">
              Email
            </label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваш email"
              />
            </div>
          </div>

          <div className="input-field">
            <label htmlFor="password" className="input-label">
              Пароль
            </label>
            <div className="input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-value"
                required
                placeholder="Введите ваш пароль"
              />
              <button
                type="button"
                className="eye-toggle"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? (
                  <EyeOff size={24} />
                ) : (
                  <Eye size={24} />
                )}
              </button>
            </div>
          </div>

          <div className="button-group">
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              {loading ? 'Вход...' : 'Войти'}
            </button>
          </div>

          <div className="register-link-wrapper">
            <button
              type="button"
              className="register-link"
              onClick={onSwitchToRegister}
            >
              Зарегистрироваться
            </button>
          </div>

          <div className="social-icons">
            <button type="button" className="social-icon" aria-label="Google">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M0 13C0 5.82071 5.82071 0 13 0C16.4266 0 19.5338 1.33661 21.8526 3.49765C22.0511 3.68263 22.1659 3.94032 22.1706 4.2116C22.1754 4.48288 22.0698 4.74445 21.8779 4.93631L18.4837 8.33051C18.1092 8.70501 17.5077 8.72257 17.112 8.37056C16.0144 7.3942 14.5783 6.8 13 6.8C9.57609 6.8 6.8 9.57609 6.8 13C6.8 16.4239 9.57609 19.2 13 19.2C15.1651 19.2 17.0695 18.087 18.1771 16.4H13C12.4477 16.4 12 15.9523 12 15.4V10.6C12 10.0477 12.4477 9.6 13 9.6H24.7666C25.244 9.6 25.6548 9.9374 25.7475 10.4057C25.9109 11.2303 26 12.1306 26 13C26 20.1793 20.1793 26 13 26C5.82071 26 0 20.1793 0 13ZM13 2C6.92528 2 2 6.92528 2 13C2 19.0747 6.92528 24 13 24C19.0747 24 24 19.0747 24 13C24 12.5366 23.97 12.0614 23.9137 11.6H14V14.4H19.7818C20.1065 14.4 20.411 14.5577 20.5984 14.8228C20.7858 15.088 20.8328 15.4277 20.7245 15.7338C19.5988 18.9128 16.5726 21.2 13 21.2C8.47152 21.2 4.8 17.5285 4.8 13C4.8 8.47152 8.47152 4.8 13 4.8C14.751 4.8 16.3696 5.35359 17.6982 6.28761L19.6972 4.28859C17.8407 2.8555 15.5223 2 13 2Z" fill="black"/>
              </svg>
            </button>
            <button type="button" className="social-icon" aria-label="VK">
              <svg width="32" height="20" viewBox="0 0 32 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M30.8733 16.1533C30.1481 14.6926 29.1925 13.3584 28.0433 12.2017C27.6523 11.7471 27.1937 11.2984 26.8357 10.9482L26.7857 10.8993C26.6011 10.7186 26.4485 10.5686 26.3237 10.4393C27.8951 8.25432 29.2399 5.9146 30.3373 3.4563L30.3816 3.35711L30.4126 3.25302C30.5569 2.76916 30.7229 1.84907 30.1353 1.01756C29.528 0.158119 28.5554 0.00312288 27.9043 0.00312288H24.9082C24.2835 -0.0255126 23.6651 0.143342 23.141 0.486639C22.6131 0.832527 22.2092 1.33704 21.987 1.9268C21.3417 3.46372 20.5343 4.9256 19.5796 6.28797V2.77692C19.5796 2.32307 19.5369 1.56386 19.0509 0.923055C18.4691 0.155805 17.6276 0.00312288 17.0435 0.00312288H12.2894C11.677 -0.011043 11.0813 0.207966 10.6235 0.616786C10.1547 1.03546 9.86735 1.62028 9.8225 2.24724L9.81825 2.30663V2.36618C9.81825 3.01348 10.0747 3.49096 10.2797 3.79125C10.3714 3.9257 10.4695 4.04808 10.5315 4.12538L10.5458 4.14322C10.6119 4.22564 10.6561 4.28065 10.7003 4.34088C10.8168 4.49931 10.9843 4.74357 11.0317 5.37565V7.3396C10.2121 5.99231 9.34755 4.19942 8.69701 2.28458L8.68703 2.2552L8.67596 2.22621C8.51375 1.80138 8.25359 1.18324 7.73255 0.710219C7.12384 0.157616 6.40386 0.00312288 5.74909 0.00312288H2.70916C2.04675 0.00312288 1.24818 0.158088 0.652315 0.786658C0.066364 1.40477 0 2.14542 0 2.53923V2.71674L0.0373851 2.89026C0.879392 6.79841 2.61435 10.4582 5.10595 13.5835C6.23557 15.365 7.76624 16.8582 9.57617 17.9434C11.415 19.0459 13.4894 19.6959 15.6286 19.8396L15.6845 19.8434H15.7404C16.7082 19.8434 17.7171 19.7598 18.4757 19.2543C19.4992 18.5723 19.5796 17.5248 19.5796 17.0029V15.4856C19.8422 15.6979 20.1681 15.9837 20.5671 16.3678C21.0493 16.8506 21.4333 17.2688 21.7627 17.6339L21.9384 17.8293L21.9395 17.8304C22.1952 18.1152 22.447 18.3955 22.6762 18.626C22.9643 18.9157 23.3195 19.2348 23.766 19.4706C24.2495 19.7259 24.7569 19.8413 25.2959 19.8413H28.3379C28.9788 19.8413 29.898 19.6897 30.5442 18.9405C31.2486 18.124 31.1947 17.1232 30.9733 16.404L30.9335 16.2746L30.8733 16.1533ZM23.2477 16.2942C22.9052 15.9145 22.4922 15.4646 21.9705 14.9428L21.9661 14.9385C20.158 13.1953 19.3131 12.8915 18.7157 12.8915C18.398 12.8915 18.0464 12.9271 17.8183 13.2114C17.7106 13.3455 17.654 13.5073 17.6223 13.676C17.5906 13.8444 17.5796 14.0421 17.5796 14.2673V17.0029C17.5796 17.3426 17.5238 17.4852 17.3666 17.59C17.1573 17.7294 16.71 17.8425 15.7516 17.8434C13.9324 17.7193 12.1686 17.1658 10.6047 16.2281C9.03756 15.2885 7.71611 13.99 6.74916 12.4396L6.73864 12.4227L6.72618 12.4072C4.4045 9.51751 2.7867 6.12762 2.0004 2.50546C2.00466 2.33085 2.0425 2.22726 2.10379 2.16261C2.16695 2.09598 2.31998 2.00312 2.70916 2.00312H5.74909C6.08726 2.00312 6.26227 2.07668 6.38822 2.19103C6.53102 2.32066 6.65487 2.54081 6.80534 2.9339C7.55149 5.12853 8.56051 7.1809 9.516 8.69002C9.99358 9.44431 10.4636 10.0721 10.8871 10.5158C11.0984 10.7373 11.3058 10.9208 11.5036 11.0513C11.6951 11.1776 11.9122 11.2772 12.1354 11.2772C12.2532 11.2772 12.391 11.2651 12.5237 11.2063C12.6664 11.1431 12.7772 11.0378 12.8554 10.8967C12.9938 10.6471 13.0317 10.2773 13.0317 9.79294V5.30799L13.0311 5.29747C12.9619 4.20634 12.6325 3.59258 12.3117 3.15624C12.2414 3.06062 12.1721 2.97424 12.1115 2.89866L12.0948 2.87794C12.0282 2.79488 11.9752 2.72776 11.9317 2.66393C11.8519 2.54699 11.8209 2.46545 11.8184 2.37808C11.8288 2.27437 11.8777 2.17814 11.9557 2.10852C12.0366 2.03625 12.1425 1.99863 12.2509 2.00312H17.0435C17.3183 2.00312 17.4108 2.07016 17.4574 2.13157C17.5231 2.21827 17.5796 2.39857 17.5796 2.77692V8.81507C17.5796 9.53232 17.9102 10.0178 18.3904 10.0178C18.9429 10.0178 19.3412 9.6826 20.0377 8.98614L20.0493 8.97451L20.0597 8.9618C21.6208 7.05808 22.8966 4.93731 23.8463 2.66591L23.8523 2.64888C23.9237 2.44817 24.0588 2.27634 24.237 2.1596C24.4152 2.04286 24.6267 1.98763 24.8393 2.00233L24.8507 2.00312H27.9043C28.3207 2.00312 28.4577 2.10911 28.502 2.17178C28.5491 2.23847 28.5819 2.38139 28.5018 2.66167C27.407 5.11021 26.0532 7.43439 24.464 9.59515L24.454 9.61046C24.2997 9.84637 24.1305 10.1074 24.106 10.4072C24.0797 10.7291 24.219 11.0217 24.4627 11.3353C24.6403 11.5979 25.0066 11.9564 25.3781 12.3202L25.4132 12.3544C25.8028 12.7358 26.2248 13.1488 26.5637 13.5487L26.5727 13.5594L26.5826 13.5693C27.5926 14.5767 28.4324 15.7413 29.0694 17.0176C29.171 17.3651 29.1088 17.5427 29.0298 17.6343C28.9373 17.7415 28.7302 17.8413 28.3379 17.8413H25.2959C25.0585 17.8413 24.875 17.7945 24.6999 17.702C24.5173 17.6056 24.3296 17.4522 24.0941 17.2155C23.9045 17.0249 23.6973 16.7943 23.4446 16.513C23.3819 16.4433 23.3163 16.3703 23.2477 16.2942Z" fill="black"/>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
