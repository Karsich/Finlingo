import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';
import HoneycombDecoration from '../components/HoneycombDecoration';
import './Login.css';

const Login = () => {
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
    <div className="login-page">
      <div className="login-container">
        {/* Левая часть с декоративными элементами */}
        <div className="login-decoration">
          {/* Слой 1: Сетка из сот (задний слой) */}
          <div className="honeycomb-layer">
            <HoneycombDecoration />
          </div>
          
          {/* Слой 2: Маскот (передний слой) */}
          <div className="mascot-layer">
            <img 
              src="/mascot.png" 
              alt="Mascot" 
              className="mascot-image"
              onError={(e) => {
                // Если изображение не найдено, скрываем его
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>

        {/* Правая часть с формой */}
        <div className="login-form-wrapper">
          <form onSubmit={handleSubmit} className="login-form">
            {/* Поле Email */}
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

            {/* Поле Password */}
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

            {/* Забыли пароль */}
            <Link to="/forgot-password" className="forgot-password-link">
              Забыли пароль?
            </Link>

            {/* Кнопка входа */}
            <div className="button-group">
              <button
                type="submit"
                className="login-button"
                disabled={loading}
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>

            {/* Ссылка на регистрацию */}
            <div className="register-link-wrapper">
              <div className="divider-line"></div>
              <Link to="/register" className="register-link">
                Зарегистрироваться
              </Link>
              <div className="divider-line"></div>
            </div>

            {/* Социальные сети */}
            <div className="social-icons">
              <button type="button" className="social-icon" aria-label="Google">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                </svg>
              </button>
              <button type="button" className="social-icon" aria-label="VK">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.091 23.574C16.577 23.574 16.989 23.445 17.326 23.188C17.664 22.93 17.882 22.553 17.982 22.057L19.246 17.012C19.336 16.565 19.431 16.117 19.53 15.67C19.63 15.223 19.73 14.775 19.829 14.328C19.929 13.891 19.979 13.469 19.979 13.063C19.979 12.656 19.89 12.313 19.712 12.031C19.534 11.75 19.273 11.609 18.927 11.609H17.015C16.731 11.609 16.501 11.738 16.326 11.996C16.151 12.254 16.064 12.586 16.064 12.992C16.064 13.398 16.094 13.82 16.154 14.258C16.215 14.695 16.28 15.133 16.351 15.57C16.421 16.008 16.472 16.43 16.503 16.836C16.534 17.242 16.55 17.578 16.55 17.844C16.55 18.109 16.515 18.305 16.444 18.43C16.374 18.555 16.259 18.617 16.099 18.617H14.187C13.907 18.617 13.674 18.484 13.486 18.219C13.299 17.953 13.148 17.586 13.032 17.117L11.769 12.072C11.679 11.625 11.549 11.266 11.38 10.992C11.211 10.719 11.002 10.582 10.754 10.582H8.842C8.504 10.582 8.26 10.758 8.111 11.109C7.962 11.461 7.888 11.914 7.888 12.469C7.888 13.024 7.962 13.586 8.111 14.156C8.26 14.727 8.504 15.297 8.842 15.867L10.106 18.43C10.357 18.93 10.608 19.434 10.858 19.941C11.108 20.449 11.358 20.961 11.608 21.477C11.858 21.992 12.104 22.508 12.344 23.023C12.584 23.539 12.824 24.055 13.065 24.57C13.305 25.086 13.545 25.594 13.785 26.094C14.025 26.594 14.261 27.086 14.491 27.57C14.722 28.055 14.952 28.523 15.183 28.977C15.413 29.43 15.644 29.867 15.874 30.289C16.105 30.711 16.335 31.109 16.565 31.484C16.796 31.859 17.026 32.211 17.257 32.539C17.487 32.867 17.718 33.164 17.948 33.43C18.179 33.695 18.409 33.93 18.64 34.133C18.87 34.336 19.101 34.5 19.331 34.625C19.562 34.75 19.792 34.813 20.023 34.813H22.339C22.714 34.813 22.997 34.625 23.189 34.25C23.38 33.875 23.476 33.359 23.476 32.703C23.476 32.047 23.38 31.383 23.189 30.711C22.997 30.039 22.714 29.359 22.339 28.672L19.874 24.07C19.55 23.508 19.266 22.93 19.022 22.336C18.777 21.742 18.573 21.133 18.409 20.508C18.245 19.883 18.163 19.242 18.163 18.586C18.163 17.93 18.245 17.32 18.409 16.758C18.573 16.195 18.777 15.727 19.022 15.352C19.266 14.977 19.55 14.727 19.874 14.602C20.198 14.477 20.523 14.414 20.847 14.414H22.759C23.094 14.414 23.377 14.539 23.608 14.789C23.84 15.039 24.005 15.414 24.106 15.914L25.369 20.859C25.469 21.336 25.584 21.766 25.714 22.148C25.844 22.531 25.989 22.867 26.148 23.156C26.307 23.445 26.48 23.688 26.668 23.883C26.855 24.078 27.057 24.227 27.273 24.328C27.488 24.43 27.719 24.48 27.964 24.48H29.875C30.214 24.48 30.462 24.313 30.619 23.977C30.776 23.641 30.855 23.195 30.855 22.641C30.855 22.086 30.776 21.508 30.619 20.906C30.462 20.305 30.214 19.68 29.875 19.031L28.611 16.469C28.359 15.969 28.108 15.465 27.858 14.957C27.608 14.449 27.358 13.938 27.108 13.422C26.858 12.906 26.613 12.391 26.373 11.875C26.133 11.359 25.893 10.844 25.652 10.328C25.412 9.813 25.172 9.305 24.932 8.805C24.691 8.305 24.456 7.813 24.226 7.328C23.995 6.844 23.765 6.375 23.534 5.922C23.304 5.469 23.073 5.031 22.843 4.609C22.612 4.188 22.382 3.789 22.151 3.414C21.921 3.039 21.69 2.688 21.46 2.359C21.23 2.031 21 1.734 20.769 1.469C20.538 1.203 20.308 0.969 20.077 0.766C19.847 0.563 19.617 0.398 19.386 0.273C19.155 0.148 18.925 0.086 18.694 0.086H16.378C16.003 0.086 15.72 0.273 15.528 0.648C15.337 1.023 15.241 1.539 15.241 2.195C15.241 2.852 15.337 3.516 15.528 4.188C15.72 4.859 16.003 5.539 16.378 6.227L18.843 10.828C19.167 11.391 19.451 11.969 19.695 12.563C19.94 13.156 20.144 13.766 20.308 14.391C20.472 15.016 20.554 15.656 20.554 16.313C20.554 16.969 20.472 17.578 20.308 18.141C20.144 18.703 19.94 19.172 19.695 19.547C19.451 19.922 19.167 20.172 18.843 20.297C18.519 20.422 18.194 20.484 17.87 20.484H15.958C15.622 20.484 15.339 20.359 15.108 20.109C14.876 19.859 14.711 19.484 14.61 18.984L13.347 14.039C13.247 13.563 13.132 13.133 13.002 12.75C12.872 12.367 12.727 12.031 12.568 11.742C12.409 11.453 12.236 11.211 12.049 11.016C11.861 10.82 11.659 10.672 11.444 10.57C11.228 10.469 10.997 10.418 10.752 10.418Z" fill="#000000"/>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
