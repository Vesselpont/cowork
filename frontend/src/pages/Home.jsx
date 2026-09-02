import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import api from '../api/axios';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await api.get('/rooms');
      setRooms(response.data.data);
    } catch (err) {
      console.error('Ошибка загрузки комнат:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = (room) => {
    if (!user) {
      window.location.href = '/login';
    } else {
      setSelectedRoom(room);
      setShowBookingModal(true);
    }
  };

  const handleBookingSuccess = () => {
    alert('✅ Бронирование успешно создано!');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero секция */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">
            Найдите идеальное пространство для работы
          </h1>
          <p className="text-xl mb-8 text-gray-300">
            Современные коворкинги и переговорные комнаты для ваших задач
          </p>
          <a 
            href="#rooms" 
            className="bg-white text-gray-900 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition inline-block shadow-lg"
          >
            Смотреть комнаты
          </a>
        </div>
      </div>

      {/* Секция с комнатами */}
      <div id="rooms" className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-900">
          Доступные помещения
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div 
              key={room._id} 
              className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
            >
              {/* Изображение комнаты */}
              <div className="h-48 overflow-hidden bg-gray-200">
                {room.image ? (
                  <img 
                    src={room.image} 
                    alt={room.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <svg className="w-20 h-20 text-gray-400 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 text-gray-900">
                  {room.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {room.description || 'Современное оборудованное помещение'}
                </p>
                
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-gray-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span className="font-medium">
                      До {room.capacity} чел.
                    </span>
                  </div>
                  
                  <button
                    onClick={() => handleBookRoom(room)}
                    className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-2 rounded-lg font-medium transition shadow-md hover:shadow-lg border border-gray-700"
                  >
                    Забронировать
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-xl">Пока нет доступных комнат</p>
            <p className="text-gray-400 mt-2">Обратитесь к администратору</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2026 CoWork Platform. Все права защищены.
          </p>
        </div>
      </footer>

      {/* Модальное окно бронирования */}
      {showBookingModal && selectedRoom && (
        <BookingModal
          room={selectedRoom}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedRoom(null);
          }}
          onSuccess={handleBookingSuccess}
        />
      )}
    </div>
  );
};

export default Home;