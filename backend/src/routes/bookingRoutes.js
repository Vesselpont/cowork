const express = require('express');
const router = express.Router();
const { createBooking, getBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middlewares/auth');
const { actionLogger } = require('../middlewares/logger');

router.post('/', protect, actionLogger('BOOKING'), createBooking);
router.get('/', protect, getBookings);
router.delete('/:id', protect, actionLogger('CANCEL_BOOKING'), cancelBooking);

module.exports = router;