import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, LogOut, Settings, Heart } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
    setShowDropdown(false);
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
    <nav className="navbar">
      <div className="container">
        <div className="navbar-content">
          <Link to="/" className="logo">
            Fingram
          </Link>
          
          {isAuthenticated ? (
            <div className="nav-links">
              <Link to="/dashboard" className="nav-link">
                Главная
              </Link>
              <Link to="/profile" className="nav-link">
                Профиль
              </Link>
              
              <div className="user-menu">
                <div 
                  className="user-avatar"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  {user?.avatar_url ? (
                    <img 
                      src={user.avatar_url} 
                      alt="Аватар" 
                      style={{ width: '100%', height: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    getInitials(user?.full_name || 'U')
                  )}
                </div>
                
                {showDropdown && (
                  <div className="dropdown">
                    <div className="dropdown-item">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        {user?.full_name}
                      </div>
                    </div>
                    <Link 
                      to="/profile" 
                      className="dropdown-item"
                      onClick={() => setShowDropdown(false)}
                    >
                      <div className="flex items-center gap-2">
                        <Settings size={16} />
                        Настройки
                      </div>
                    </Link>
                    <button 
                      className="dropdown-item"
                      onClick={handleLogout}
                      style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}
                    >
                      <div className="flex items-center gap-2">
                        <LogOut size={16} />
                        Выйти
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="auth-section">
              <Link to="/login" className="btn btn-outline">
                Войти
              </Link>
              <Link to="/register" className="btn btn-primary">
                Регистрация
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
