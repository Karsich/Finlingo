import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { livesAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Settings, User } from 'lucide-react';
import HoneycombDecoration from '../components/HoneycombDecoration';
import './Dashboard.css';
// Изображения из public папки доступны через абсолютные пути
const mascotImage = '/mascot.png';
const mascotV10Image = '/mascot-v10.png';
const mascotV16Image = '/mascot-v16.png';

const Dashboard = () => {
  const { user } = useAuth();
  const [lives, setLives] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLives();
  }, []);

  const fetchLives = async () => {
    try {
      const response = await livesAPI.getMyLives();
      setLives(response.data);
    } catch (error) {
      console.error('Ошибка загрузки жизней');
    } finally {
      setLoading(false);
    }
  };

  const handleStartCourse = () => {
    if (lives?.current_lives <= 0) {
      alert('У вас закончились жизни!');
      return;
    }
    // Здесь будет логика начала курса
    navigate('/courses');
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

  // Прогресс (замените, когда появится API): читаем из user?.progress, иначе 0/10
  const getProgress = (key) => {
    const total = user?.progress?.[key]?.total ?? 10;
    const current = Math.max(0, Math.min(total, user?.progress?.[key]?.current ?? 0));
    const percent = total > 0 ? (current / total) * 100 : 0;
    return { current, total, percent };
  };

  const jobProgress = getProgress('job');
  const rentProgress = getProgress('rent');

  return (
    <div className="dashboard-main">
      <div className="dashboard-container">
        <div className="dashboard-inner">
        {/* Шапка */}
        <div className="dashboard-header">
          {/* Футер (верхняя панель) */}
          <div className="header-footer">
            <div className="header-logo">ЛОГОТИП</div>
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
              Где и как снимать жильё? Что такое резюме и как пройти собеседование? 
              На наших уроках ты узнаешь как пройти квест под названием взрослая жизнь и не сойти с ума
            </p>
            <div className="header-buttons">
              <button 
                className="btn-primary-dashboard"
                onClick={handleStartCourse}
              >
                НАЧАТЬ
              </button>
              <button 
                className="btn-secondary-dashboard"
                onClick={() => navigate('/profile')}
              >
                У МЕНЯ ЕСТЬ АККАУНТ
              </button>
            </div>
          </div>

          {/* Футер в шапке */}
          <div className="header-footer">
            <div className="header-logo">ЛОГОТИП</div>
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
            <div className="course-card right no-top-gap">
              <div className="course-card-icon"></div>
              <h3 className="course-card-title">Как снять квартиру?</h3>
              <p className="course-card-description">
                Узнай как найти подходящее жильё, как проверить договор аренды,
                как вести переговоры с арендодателем и не попасться на мошенников
              </p>
              <div className="progress-group">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${rentProgress.percent}%` }}></div>
                  <div className="progress-text">{`${rentProgress.current}/${rentProgress.total}`}</div>
                </div>
              </div>
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
              <div className="course-card-icon"></div>
              <h3 className="course-card-title">Как найти работу?</h3>
              <p className="course-card-description">
                На наших уроках ты узнаешь как правильно составить резюме,
                как подготовиться к собеседованию и как найти работу своей мечты
              </p>
              <div className="progress-group">
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${jobProgress.percent}%` }}></div>
                  <div className="progress-text">{`${jobProgress.current}/${jobProgress.total}`}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Футер внизу */}
        <div className="dashboard-footer">
          <div className="dashboard-footer-content">
            <div className="footer-logo">ЛОГОТИП</div>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
