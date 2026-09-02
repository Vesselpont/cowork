import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-gray-900 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Логотип */}
        <Link to="/" className="text-2xl font-bold text-white">
          CoWork Platform
        </Link>
        
        {/* Правая часть */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-gray-300">
                {user.name}
              </span>
              {user.role === 'admin' && (
                <Link 
                  to="/admin" 
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
                >
                  Админка
                </Link>
              )}
              <Link 
                to="/bookings" 
                className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition border border-gray-600"
              >
                Мои бронирования
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-gray-300 hover:text-white font-medium px-4 py-2 transition"
              >
                Вход
              </Link>
              <Link 
                to="/register" 
                className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition border border-gray-600"
              >
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Header;