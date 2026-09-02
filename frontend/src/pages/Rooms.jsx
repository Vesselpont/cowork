import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookingModal from '../components/BookingModal';
import api from '../api/axios';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
      setError('Ошибка загрузки комнат');
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
        Все помещения
      </h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <div 
            key={room._id} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200"
          >
            {/* Изображение комнаты */}
            <div className="h-40 overflow-hidden bg-gray-200">
              {room.image ? (
                <img 
                  src={room.image} 
                  alt={room.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-gray-700 to-gray-900"></div>
              )}
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{room.title}</h3>
              <p className="text-gray-600 mb-4">{room.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-gray-800 font-semibold">
                  {room.capacity} человек
                </span>
                <button
                  onClick={() => handleBookRoom(room)}
                  className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition"
                >
                  Забронировать
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {rooms.length === 0 && (
        <p className="text-center text-gray-500 py-12">
          Комнаты не найдены
        </p>
      )}

      {/* Модальное окно */}
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

export default Rooms;