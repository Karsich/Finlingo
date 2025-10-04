import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { livesAPI } from '../services/api';
import { Heart, BookOpen, Trophy, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const [lives, setLives] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLives();
  }, []);

  const fetchLives = async () => {
    try {
      const response = await livesAPI.getMyLives();
      setLives(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки жизней');
    } finally {
      setLoading(false);
    }
  };

  const handleUseLife = async () => {
    if (lives.current_lives <= 0) {
      toast.error('У вас закончились жизни!');
      return;
    }

    try {
      const response = await livesAPI.useLife();
      setLives(prev => ({
        ...prev,
        current_lives: response.data.remaining_lives
      }));
      toast.success('Жизнь использована!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка использования жизни');
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="text-center">
          <div className="text-lg">Загрузка...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Добро пожаловать, {user?.full_name}!</h1>
          <p className="page-subtitle">
            Изучайте бытовые темы и развивайте свои навыки
          </p>
        </div>

        {/* Карточка с жизнями */}
        <div className="lives-card">
          <div className="lives-count">
            {lives?.current_lives || 0}
          </div>
          <div className="lives-label">
            Жизней осталось сегодня
          </div>
          <div className="text-sm mt-2 opacity-75">
            Максимум: {lives?.max_lives || 3} жизней
          </div>
        </div>

        {/* Статистика */}
        <div className="card mb-6">
          <h2 className="section-title">Ваша статистика</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <BookOpen className="mx-auto mb-2 text-blue-600" size={32} />
              <div className="text-2xl font-bold text-blue-600">0</div>
              <div className="text-gray-600">Пройденных уроков</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Trophy className="mx-auto mb-2 text-green-600" size={32} />
              <div className="text-2xl font-bold text-green-600">0</div>
              <div className="text-gray-600">Достижений</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Clock className="mx-auto mb-2 text-purple-600" size={32} />
              <div className="text-2xl font-bold text-purple-600">0</div>
              <div className="text-gray-600">Минут обучения</div>
            </div>
          </div>
        </div>

        {/* Доступные темы */}
        <div className="card">
          <h2 className="section-title">Доступные темы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-lg mb-2">Оплата налогов</h3>
              <p className="text-gray-600 mb-3">
                Изучите, как правильно заполнять налоговые декларации и платить налоги
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleUseLife}
                disabled={lives?.current_lives <= 0}
              >
                Начать урок
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-lg mb-2">Заполнение документов</h3>
              <p className="text-gray-600 mb-3">
                Научитесь правильно заполнять различные документы и формы
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleUseLife}
                disabled={lives?.current_lives <= 0}
              >
                Начать урок
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-lg mb-2">Мелкий ремонт</h3>
              <p className="text-gray-600 mb-3">
                Освойте базовые навыки ремонта в доме своими руками
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleUseLife}
                disabled={lives?.current_lives <= 0}
              >
                Начать урок
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
              <h3 className="font-bold text-lg mb-2">Стирка и уход</h3>
              <p className="text-gray-600 mb-3">
                Изучите правильные способы стирки и ухода за одеждой
              </p>
              <button 
                className="btn btn-primary"
                onClick={handleUseLife}
                disabled={lives?.current_lives <= 0}
              >
                Начать урок
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
