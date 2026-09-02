const Room = require('../models/Room');
const AppError = require('../utils/AppError');

exports.getAllRooms = async (req, res, next) => {
  try {
    const { search, sort } = req.query;
    let query = {};
    if (search) query = { $text: { $search: search } };

    let sortOptions = {};
    if (sort === 'capacity_asc') sortOptions = { capacity: 1 };
    if (sort === 'capacity_desc') sortOptions = { capacity: -1 };

    const rooms = await Room.find(query).sort(sortOptions);
    res.status(200).json({ status: 'success', results: rooms.length, data: rooms });
  } catch (err) { next(err); }
};

exports.createRoom = async (req, res, next) => {
  try {
    const room = await Room.create(req.body);
    res.status(201).json({ status: 'success', data: room });
  } catch (err) { next(err); }
};

exports.deleteRoom = async (req, res, next) => {
  try {
    const room = await Room.findByIdAndDelete(req.params.id);
    if (!room) return next(new AppError('Помещение не найдено', 404));
    res.status(204).json({ status: 'success', data: null });
  } catch (err) { next(err); }
};