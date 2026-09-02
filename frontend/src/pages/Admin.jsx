import { useState, useEffect } from 'react';
import api from '../api/axios';

const Admin = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newRoom, setNewRoom] = useState({ 
    title: '', 
    capacity: '', 
    description: '',
    image: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        api.get('/rooms'),
        api.get('/bookings')
      ]);
      setRooms(roomsRes.data.data);
      setBookings(bookingsRes.data.data);
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
    } finally {
      setLoading(false);
    }
  };

  const createRoom = async (e) => {
    e.preventDefault();
    try {
      await api.post('/rooms', {
        title: newRoom.title,
        capacity: parseInt(newRoom.capacity),
        description: newRoom.description,
        image: newRoom.image
      });
      setNewRoom({ title: '', capacity: '', description: '', image: '' });
      fetchData();
    } catch (err) {
      alert('Ошибка создания комнаты');
    }
  };

  const deleteRoom = async (id) => {
    if (!window.confirm('Удалить эту комнату?')) return;
    try {
      await api.delete(`/rooms/${id}`);
      fetchData();
    } catch (err) {
      alert('Ошибка удаления комнаты');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Панель администратора</h1>

      {/* Создание комнаты */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Создать новую комнату</h2>
        <form onSubmit={createRoom} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Название</label>
            <input
              type="text"
              value={newRoom.title}
              onChange={(e) => setNewRoom({...newRoom, title: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Вместимость</label>
            <input
              type="number"
              value={newRoom.capacity}
              onChange={(e) => setNewRoom({...newRoom, capacity: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Описание</label>
            <textarea
              value={newRoom.description}
              onChange={(e) => setNewRoom({...newRoom, description: e.target.value})}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              rows="3"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">URL изображения</label>
            <input
              type="url"
              value={newRoom.image}
              onChange={(e) => setNewRoom({...newRoom, image: e.target.value})}
              placeholder="https://example.com/image.jpg"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
            <p className="text-xs text-gray-500 mt-1">
              Вставьте ссылку на изображение (Unsplash, Imgur и т.д.)
            </p>
          </div>
          <button
            type="submit"
            className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            Создать комнату
          </button>
        </form>
      </div>

      {/* Список комнат */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">Все комнаты</h2>
        <div className="space-y-2">
          {rooms.map((room) => (
            <div key={room._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                {room.image && (
                  <img src={room.image} alt={room.title} className="w-12 h-12 object-cover rounded" />
                )}
                <div>
                  <span className="font-semibold">{room.title}</span>
                  <span className="text-gray-600 ml-4">({room.capacity} чел.)</span>
                </div>
              </div>
              <button
                onClick={() => deleteRoom(room._id)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Все бронирования */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold mb-4">Все бронирования</h2>
        <div className="space-y-2">
          {bookings.map((booking) => (
            <div key={booking._id} className="p-3 bg-gray-50 rounded">
              <p className="font-semibold">
                {booking.room?.title} - {booking.user?.name}
              </p>
              <p className="text-sm text-gray-600">
                {new Date(booking.startTime).toLocaleString('ru-RU')} - {new Date(booking.endTime).toLocaleString('ru-RU')}
              </p>
              <span className={`inline-block mt-1 px-2 py-1 rounded text-xs ${
                booking.status === 'active' ? 'bg-gray-200 text-gray-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {booking.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;