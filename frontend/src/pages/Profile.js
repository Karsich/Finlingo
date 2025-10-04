import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usersAPI, livesAPI } from '../services/api';
import { Heart, Upload, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [lives, setLives] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    full_name: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email || '',
        username: user.username || '',
        full_name: user.full_name || '',
        phone: user.phone || ''
      });
    }
    fetchLives();
  }, [user]);

  const fetchLives = async () => {
    try {
      const response = await livesAPI.getMyLives();
      setLives(response.data);
    } catch (error) {
      toast.error('Ошибка загрузки жизней');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await usersAPI.updateProfile(formData);
      updateUser(response.data);
      toast.success('Профиль успешно обновлен!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка обновления профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Файл должен быть изображением');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast.error('Размер файла не должен превышать 5MB');
      return;
    }

    try {
      const response = await usersAPI.uploadAvatar(file);
      const updatedUser = { ...user, avatar_url: response.data.avatar_url };
      updateUser(updatedUser);
      toast.success('Аватар успешно загружен!');
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка загрузки аватара');
    }
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="container">
      <div className="page-container">
        <div className="page-header">
          <h1 className="page-title">Мой профиль</h1>
          <p className="page-subtitle">
            Управляйте информацией о своем аккаунте
          </p>
        </div>

        {/* Карточка с жизнями */}
        {lives && (
          <div className="lives-card">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Heart className="text-white" size={24} />
              <span className="text-lg">Ваши жизни</span>
            </div>
            <div className="lives-count">
              {lives.current_lives}
            </div>
            <div className="lives-label">
              из {lives.max_lives} максимальных
            </div>
            <div className="text-sm mt-2 opacity-75">
              Последний сброс: {new Date(lives.last_reset_date).toLocaleDateString('ru-RU')}
            </div>
          </div>
        )}

        {/* Информация о профиле */}
        <div className="card mb-6">
          <h2 className="section-title">Информация о профиле</h2>
          
          <div className="profile-info">
            <div className="info-item">
              <span className="info-label">ID пользователя</span>
              <span className="info-value">{user?.id}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Дата регистрации</span>
              <span className="info-value">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('ru-RU') : 'Неизвестно'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Статус аккаунта</span>
              <span className={`info-value ${user?.is_active ? 'text-green-600' : 'text-red-600'}`}>
                {user?.is_active ? 'Активен' : 'Заблокирован'}
              </span>
            </div>
          </div>
        </div>

        {/* Редактирование профиля */}
        <div className="card">
          <h2 className="section-title">Редактировать профиль</h2>
          
          <form onSubmit={handleSubmit}>
            {/* Аватар */}
            <div className="mb-6">
              <label className="form-label">Аватар</label>
              <div className="avatar-upload">
                <div className="avatar-preview">
                  {user?.avatar_url ? (
                    <img src={user.avatar_url} alt="Аватар" />
                  ) : (
                    getInitials(user?.full_name || 'U')
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    id="avatar"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                  <label htmlFor="avatar" className="btn btn-outline">
                    <Upload size={16} className="mr-2" />
                    Загрузить фото
                  </label>
                  <p className="text-sm text-gray-600 mt-1">
                    Максимальный размер: 5MB
                  </p>
                </div>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Имя пользователя
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="full_name" className="form-label">
                Полное имя
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone" className="form-label">
                Телефон
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Сохранение...' : 'Сохранить изменения'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
