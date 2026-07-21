import Event from '../models/Event.js';
import { eventStore, isMongoConnected } from '../utils/storage.js';

const getEventModel = async () => (isMongoConnected() ? Event : null);

export const getAllEvents = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    const { search, category, venue, sort } = req.query;

    if (!EventModel) {
      const events = await eventStore.findAll({ search, category, venue, sort });
      return res.json(events);
    }

    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (category) {
      query.category = category;
    }

    if (venue) {
      query.venue = { $regex: venue, $options: 'i' };
    }

    let events = await EventModel.find(query).populate('createdBy', 'name email');

    if (sort === 'latest') {
      events = [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      events = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch events', error: error.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json(event);
    }

    const event = await EventModel.findById(req.params.id).populate('createdBy', 'name email');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event', error: error.message });
  }
};

export const createEvent = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.create({ ...req.body, createdBy: req.user._id || req.user.id });
      return res.status(201).json(event);
    }

    const event = await EventModel.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create event', error: error.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      if (event.createdBy !== (req.user._id || req.user.id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      const updatedEvent = await eventStore.update(req.params.id, req.body);
      return res.json(updatedEvent);
    }

    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedEvent = await EventModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update event', error: error.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      if (event.createdBy !== (req.user._id || req.user.id)) {
        return res.status(403).json({ message: 'Not authorized' });
      }
      await eventStore.remove(req.params.id);
      return res.json({ message: 'Event deleted successfully' });
    }

    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (event.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await EventModel.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event', error: error.message });
  }
};

export const registerForEvent = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.register(req.params.id, req.user._id || req.user.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json({ message: 'Registered successfully', event });
    }

    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.registeredUsers.includes(req.user._id)) {
      return res.status(400).json({ message: 'You are already registered' });
    }

    if (event.registeredUsers.length >= event.maxParticipants) {
      return res.status(400).json({ message: 'Event is full' });
    }

    event.registeredUsers.push(req.user._id);
    await event.save();

    res.json({ message: 'Registered successfully', event });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
};

export const cancelRegistration = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const event = await eventStore.cancelRegistration(req.params.id, req.user._id || req.user.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      return res.json({ message: 'Registration cancelled', event });
    }

    const event = await EventModel.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    event.registeredUsers = event.registeredUsers.filter((id) => id.toString() !== req.user._id.toString());
    await event.save();

    res.json({ message: 'Registration cancelled', event });
  } catch (error) {
    res.status(500).json({ message: 'Cancellation failed', error: error.message });
  }
};

export const getMyEvents = async (req, res) => {
  try {
    const EventModel = await getEventModel();
    if (!EventModel) {
      const events = await eventStore.getUserEvents(req.user._id || req.user.id);
      return res.json(events);
    }

    const createdEvents = await EventModel.find({ createdBy: req.user._id });
    const registeredEvents = await EventModel.find({ registeredUsers: req.user._id });

    res.json({ createdEvents, registeredEvents });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch my events', error: error.message });
  }
};
