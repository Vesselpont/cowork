import { useState } from 'react';
import api from '../api/axios';

const BookingModal = ({ room, onClose, onSuccess }) => {
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const currentYear = new Date().getFullYear();
      const dateString = `${currentYear}-${month}-${day.padStart(2, '0')}`;
      
      const startDateTime = new Date(`${dateString}T${startTime}`).toISOString();
      const endDateTime = new Date(`${dateString}T${endTime}`).toISOString();

      await api.post('/bookings', {
        room: room._id,
        startTime: startDateTime,
        endTime: endDateTime
      });
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Ошибка создания бронирования');
    } finally {
      setLoading(false);
    }
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  
  const months = [
    { value: '01', label: 'Январь' },
    { value: '02', label: 'Февраль' },
    { value: '03', label: 'Март' },
    { value: '04', label: 'Апрель' },
    { value: '05', label: 'Май' },
    { value: '06', label: 'Июнь' },
    { value: '07', label: 'Июль' },
    { value: '08', label: 'Август' },
    { value: '09', label: 'Сентябрь' },
    { value: '10', label: 'Октябрь' },
    { value: '11', label: 'Ноябрь' },
    { value: '12', label: 'Декабрь' }
  ];
  
  const timeSlots = [];
  for (let hour = 8; hour <= 22; hour++) {
    for (let minute of ['00', '30']) {
      const time = `${hour.toString().padStart(2, '0')}:${minute}`;
      timeSlots.push(time);
    }
  }

  const today = new Date();
  const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
  const currentDay = today.getDate();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 overflow-hidden border border-gray-200">
        {/* Картинка комнаты */}
        {room.image && (
          <div className="h-48 overflow-hidden">
            <img 
              src={room.image} 
              alt={room.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Заголовок */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-4">
          <h2 className="text-2xl font-bold text-white">
            Бронирование
          </h2>
          <p className="text-gray-300 mt-1">{room.title}</p>
        </div>
        
        {/* Тело формы */}
        <div className="p-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Выбор даты (день и месяц) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Дата (текущий год: {new Date().getFullYear()})
              </label>
              <div className="grid grid-cols-2 gap-3">
                <select
                  value={month}
                  onChange={(e) => {
                    setMonth(e.target.value);
                    setDay('');
                  }}
                  required
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Месяц</option>
                  {months.map((m) => (
                    <option 
                      key={m.value} 
                      value={m.value}
                      disabled={parseInt(m.value) < parseInt(currentMonth)}
                    >
                      {m.label}
                    </option>
                  ))}
                </select>

                <select
                  value={day}
                  onChange={(e) => setDay(e.target.value)}
                  required
                  disabled={!month}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">День</option>
                  {days.map((d) => {
                    const isDisabled = month === currentMonth && d < currentDay;
                    return (
                      <option 
                        key={d} 
                        value={d}
                        disabled={isDisabled}
                      >
                        {d}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            {/* Время начала и окончания */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Начало
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Выберите</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Окончание
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  <option value="">Выберите</option>
                  {timeSlots
                    .filter((time) => !startTime || time > startTime)
                    .map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                </select>
              </div>
            </div>

            {/* Информация о комнате */}
            <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
              <p className="text-sm text-gray-700">
                <span className="font-medium">Вместимость:</span> {room.capacity} чел.
              </p>
              {room.description && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">Описание:</span> {room.description}
                </p>
              )}
            </div>

            {/* Подсказка */}
            <div className="bg-gray-100 border border-gray-300 rounded-lg p-3 text-sm text-gray-700">
              <svg className="inline w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Выберите дату и время из доступных слотов
            </div>

            {/* Кнопки */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2.5 rounded-lg font-medium transition"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading || !day || !month || !startTime || !endTime}
                className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2.5 rounded-lg font-medium transition disabled:opacity-50 disabled:cursor-not-allowed border border-gray-700"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Бронирование...
                  </span>
                ) : (
                  'Забронировать'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;