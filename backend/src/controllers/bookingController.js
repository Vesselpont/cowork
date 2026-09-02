const Booking = require('../models/Booking');
const Room = require('../models/Room');
const AppError = require('../utils/AppError');

exports.createBooking = async (req, res, next) => {
  try {
    const { room, startTime, endTime } = req.body;
    
    // ВАЛИДАЦИЯ ДАТ
    if (!startTime || !endTime) {
      return next(new AppError('Укажите время начала и окончания', 400));
    }
    
    const start = new Date(startTime);
    const end = new Date(endTime);
    
    if (start >= end) {
      return next(new AppError('Время начала должно быть раньше времени окончания', 400));
    }
    
    if (start < new Date()) {
      return next(new AppError('Нельзя забронировать в прошлом', 400));
    }
    
    // Проверка существования комнаты
    const roomExists = await Room.findById(room);
    if (!roomExists) {
      return next(new AppError('Помещение не найдено', 404));
    }
    
    // Проверка пересечений
    const overlappingBooking = await Booking.findOne({
      room,
      status: 'active',
      $or: [
        { startTime: { $lt: end, $gte: start } },
        { endTime: { $gt: start, $lte: end } },
        { startTime: { $lte: start }, endTime: { $gte: end } }
      ]
    });
    
    if (overlappingBooking) {
      return next(new AppError('Помещение уже забронировано на это время', 400));
    }
    
    const booking = await Booking.create({
      user: req.user.id,
      room,
      startTime: start,
      endTime: end
    });
    
    res.status(201).json({
      status: 'success',
      data: booking
    });
  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const bookings = await Booking.find(query)
      .populate('room', 'title capacity')
      .populate('user', 'name email')
      .sort({ startTime: 1 });
      
    res.status(200).json({ status: 'success', results: bookings.length, data: bookings });
  } catch (err) { next(err); }
};

exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return next(new AppError('Бронирование не найдено', 404));

    if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return next(new AppError('Нет прав на отмену этого бронирования', 403));
    }
    if (booking.status === 'cancelled') return next(new AppError('Бронирование уже отменено', 400));

    booking.status = 'cancelled';
    await booking.save();
    
    res.status(200).json({ status: 'success', data: booking });
  } catch (err) { next(err); }
};