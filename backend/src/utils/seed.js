require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });
const mongoose = require('mongoose');
const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const seed = async () => {
  try {
    console.log('Подключение к Mongo');
    
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
    });
    
    console.log('Подключение установлено');
    console.log('Очистка БД');
    
    await User.deleteMany();
    await Room.deleteMany();
    await Booking.deleteMany();
    
    console.log('Создание польз.');
    
    const admin = await User.create({ 
      name: 'Admin', 
      email: 'admin@test.com', 
      password: 'admin123',
      role: 'admin' 
    });
    
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('user123', 12);
    
    const users = await User.insertMany(
      Array.from({ length: 10 }, (_, i) => ({ 
        name: `User ${i+1}`, 
        email: `user${i+1}@test.com`, 
        password: hashedPassword,
        role: 'user'
      }))
    );
    
    console.log('Создание помещений');
    const rooms = await Room.insertMany([
      { 
        title: 'Переговорная Alpha', 
        capacity: 4, 
        description: 'С проектором',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
      },
      { 
        title: 'Конференц-зал Beta', 
        capacity: 20, 
        description: 'Для больших встреч',
        image: 'https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=800'
      },
      { 
        title: 'Опенспейс', 
        capacity: 50, 
        description: 'Общая зона',
        image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800'
      },
      { 
        title: 'Капсула тишины', 
        capacity: 1, 
        description: 'Для звонков',
        image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'
      },
      { 
        title: 'Лаунж', 
        capacity: 10, 
        description: 'Зона отдыха',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800'
      }
    ]);
    
    console.log('Создание 20 бронирований.');
    const bookings = [];
    for (let i = 1; i <= 20; i++) {
      const randomUser = users[Math.floor(Math.random() * users.length)];
      const randomRoom = rooms[Math.floor(Math.random() * rooms.length)];
      const start = new Date(); 
      start.setDate(start.getDate() + i);
      const end = new Date(start); 
      end.setHours(end.getHours() + 2);
      
      bookings.push({ 
        user: randomUser._id, 
        room: randomRoom._id, 
        startTime: start, 
        endTime: end 
      });
    }
    await Booking.insertMany(bookings);
    
    console.log('Seed успешно');
    console.log('Создано:');
    console.log(`- 1 администратор (${admin.email})`);
    console.log(`- 10 пользователей`);
    console.log(`- 5 помещений`);
    console.log(`- 20 бронирований`);
    
    process.exit(0);
  } catch (err) {
    console.error('Ошибка seed:', err.message);
    process.exit(1);
  }
};

seed();