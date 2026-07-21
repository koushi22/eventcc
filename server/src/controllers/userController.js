import User from '../models/User.js';
import Event from '../models/Event.js';
import { userStore, eventStore, isMongoConnected } from '../utils/storage.js';

const getUserModel = async () => (isMongoConnected() ? User : null);
const getEventModel = async () => (isMongoConnected() ? Event : null);

export const getProfile = async (req, res) => {
  try {
    const UserModel = await getUserModel();
    const EventModel = await getEventModel();
    const userId = req.user._id || req.user.id;

    if (!UserModel || !EventModel) {
      const user = await userStore.findById(userId);
      const events = await eventStore.getUserEvents(userId);
      return res.json({ user, createdEventsCount: events.createdEvents.length, registeredEventsCount: events.registeredEvents.length });
    }

    const user = await UserModel.findById(userId).select('-password');
    const createdEvents = await EventModel.find({ createdBy: userId });
    const registeredEvents = await EventModel.find({ registeredUsers: userId });

    res.json({ user, createdEventsCount: createdEvents.length, registeredEventsCount: registeredEvents.length });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch profile', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const UserModel = await getUserModel();
    const userId = req.user._id || req.user.id;

    if (!UserModel) {
      const updatedUser = await userStore.update(userId, req.body);
      return res.json(updatedUser);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update profile', error: error.message });
  }
};
