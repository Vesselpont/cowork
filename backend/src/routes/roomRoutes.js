const express = require('express');
const router = express.Router();
const { getAllRooms, createRoom, deleteRoom } = require('../controllers/roomController');
const { protect, restrictTo } = require('../middlewares/auth');

router.get('/', getAllRooms);
router.post('/', protect, restrictTo('admin'), createRoom);
router.delete('/:id', protect, restrictTo('admin'), deleteRoom);

module.exports = router;