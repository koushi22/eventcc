import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  cancelRegistration,
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  getMyEvents,
  registerForEvent,
  updateEvent,
} from '../controllers/eventController.js';

const router = express.Router();

router.get('/', getAllEvents);
router.get('/my-events', authMiddleware, getMyEvents);
router.get('/:id', getEventById);
router.post('/', authMiddleware, createEvent);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.post('/register-event/:id', authMiddleware, registerForEvent);
router.delete('/cancel-registration/:id', authMiddleware, cancelRegistration);

export default router;
