// T:\cowork-platform\pretty-queries.js

print('\n=== 📊 ВСЕ АКТИВНЫЕ БРОНИРОВАНИЯ ===\n');

db.bookings.aggregate([
  { $match: { status: 'active' } },
  {
    $lookup: {
      from: 'users',
      localField: 'user',
      foreignField: '_id',
      as: 'user'
    }
  },
  {
    $lookup: {
      from: 'rooms',
      localField: 'room',
      foreignField: '_id',
      as: 'room'
    }
  },
  { $unwind: '$user' },
  { $unwind: '$room' },
  {
    $project: {
      _id: 0,
      '👤 Пользователь': '$user.name',
      '🏢 Комната': '$room.title',
      '📅 Дата': { $dateToString: { format: '%d.%m.%Y', date: '$startTime', timezone: '+03:00' } },
      '🕐 Время': { 
        $concat: [
          { $dateToString: { format: '%H:%M', date: '$startTime', timezone: '+03:00' } },
          ' - ',
          { $dateToString: { format: '%H:%M', date: '$endTime', timezone: '+03:00' } }
        ]
      },
      '✅ Статус': 'Активно'
    }
  }
]).forEach(doc => printjson(doc));  