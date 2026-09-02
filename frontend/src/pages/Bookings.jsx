import { useState, useEffect } from 'react';
import api from '../api/axios';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('/bookings');
      setBookings(response.data.data);
    } catch (err) {
      setError('Ошибка загрузки бронирований');
    } finally {
      setLoading(false);
    }
  };

  const cancelBooking = async (id) => {
    if (!window.confirm('Отменить это бронирование?')) return;

    try {
      await api.delete(`/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Ошибка отмены бронирования');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Мои бронирования</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking._id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2">
                  {booking.room?.title || 'Комната'}
                </h3>
                <p className="text-gray-600">
                  Начало: {new Date(booking.startTime).toLocaleString('ru-RU')}
                </p>
                <p className="text-gray-600">
                  Окончание: {new Date(booking.endTime).toLocaleString('ru-RU')}
                </p>
                <span className={`inline-block mt-2 px-3 py-1 rounded text-sm ${
                  booking.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  {booking.status === 'active' ? 'Активно' : 'Отменено'}
                </span>
              </div>
              
              {booking.status === 'active' && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Отменить
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {bookings.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          У вас пока нет бронирований
        </p>
      )}
    </div>
  );
};

export default Bookings;