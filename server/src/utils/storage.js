import mongoose from 'mongoose';

const users = [];
const events = [];
let userCounter = 1;
let eventCounter = 1;

const nextUserId = () => `user_${userCounter++}`;
const nextEventId = () => `event_${eventCounter++}`;

export const isMongoConnected = () => mongoose.connection.readyState === 1;

const buildUser = (user) => ({
  ...user,
  _id: user._id || user.id,
  id: user.id || user._id,
  createdAt: user.createdAt || new Date().toISOString(),
});

const buildEvent = (event) => ({
  ...event,
  _id: event._id || event.id,
  id: event.id || event._id,
  registeredUsers: event.registeredUsers || [],
  createdAt: event.createdAt || new Date().toISOString(),
  updatedAt: event.updatedAt || new Date().toISOString(),
});

export const userStore = {
  findByEmail: async (email) => {
    const user = users.find((item) => item.email === email);
    return user ? buildUser(user) : null;
  },
  findById: async (id) => {
    const user = users.find((item) => item._id === id || item.id === id);
    return user ? buildUser(user) : null;
  },
  create: async ({ name, email, password, profileImage = '' }) => {
    const userId = nextUserId();
    const user = buildUser({
      _id: userId,
      id: userId,
      name,
      email,
      password,
      profileImage,
    });
    users.push(user);
    return user;
  },
  update: async (id, updates) => {
    const index = users.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;
    users[index] = buildUser({ ...users[index], ...updates, updatedAt: new Date().toISOString() });
    return users[index];
  },
};

export const eventStore = {
  findAll: async ({ search, category, venue, sort } = {}) => {
    let filtered = [...events];

    if (search) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(search.toLowerCase()));
    }

    if (category) {
      filtered = filtered.filter((event) => event.category === category);
    }

    if (venue) {
      filtered = filtered.filter((event) => event.venue.toLowerCase().includes(venue.toLowerCase()));
    }

    if (sort === 'latest') {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else {
      filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
    }

    return filtered.map(buildEvent);
  },
  findById: async (id) => {
    const event = events.find((item) => item._id === id || item.id === id);
    return event ? buildEvent(event) : null;
  },
  create: async (payload) => {
    const eventId = nextEventId();
    const event = buildEvent({
      _id: eventId,
      id: eventId,
      ...payload,
      registeredUsers: [],
      status: payload.status || 'upcoming',
    });
    events.push(event);
    return event;
  },
  update: async (id, updates) => {
    const index = events.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return null;
    events[index] = buildEvent({ ...events[index], ...updates, updatedAt: new Date().toISOString() });
    return events[index];
  },
  remove: async (id) => {
    const index = events.findIndex((item) => item._id === id || item.id === id);
    if (index === -1) return false;
    events.splice(index, 1);
    return true;
  },
  register: async (id, userId) => {
    const event = events.find((item) => item._id === id || item.id === id);
    if (!event) return null;
    if (!event.registeredUsers.includes(userId)) {
      event.registeredUsers.push(userId);
    }
    return buildEvent(event);
  },
  cancelRegistration: async (id, userId) => {
    const event = events.find((item) => item._id === id || item.id === id);
    if (!event) return null;
    event.registeredUsers = event.registeredUsers.filter((value) => value !== userId);
    return buildEvent(event);
  },
  getUserEvents: async (userId) => {
    const createdEvents = events.filter((event) => event.createdBy === userId).map(buildEvent);
    const registeredEvents = events.filter((event) => event.registeredUsers.includes(userId)).map(buildEvent);
    return { createdEvents, registeredEvents };
  },
};
