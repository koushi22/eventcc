import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', venue: '', sort: '' });
  const [message, setMessage] = useState('');

  const fetchEvents = async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await api.get(`/events${query ? `?${query}` : ''}`);
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleFilterSubmit = (e) => {
    e.preventDefault();
    fetchEvents(filters);
  };

  const handleRegister = async (eventId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      await api.post(`/events/register-event/${eventId}`);
      setMessage('You are registered! Redirecting to event details...');
      setTimeout(() => {
        navigate(`/events/${eventId}`);
      }, 500);
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h1 className="text-3xl font-semibold">Browse events</h1>
        <p className="mt-2 text-slate-400">Search, filter, and discover events that fit your interests.</p>
        <form onSubmit={handleFilterSubmit} className="mt-6 grid gap-4 md:grid-cols-4">
          <input className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Search title" value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} />
          <input className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Category" value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
          <input className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Venue" value={filters.venue} onChange={(e) => setFilters({ ...filters, venue: e.target.value })} />
          <select className="rounded border border-slate-700 bg-slate-800 px-3 py-2" value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}>
            <option value="">Sort by date</option>
            <option value="latest">Latest first</option>
          </select>
          <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-white md:col-span-4">Apply filters</button>
        </form>
      </div>

      <div className="mb-4">
        {message && <p className="text-sm text-cyan-300">{message}</p>}
      </div>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {events.map((event) => (
          <div key={event._id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1">
            {event.bannerImage && (
              <img
                src={event.bannerImage}
                alt={`${event.title} banner`}
                className="h-48 w-full object-cover"
              />
            )}
            <div className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-sm text-cyan-300">{event.category}</span>
                <span className="text-sm text-slate-400">{event.date}</span>
              </div>
              <h3 className="text-xl font-semibold">{event.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{event.description.slice(0, 110)}...</p>
              <div className="mt-4 space-y-1 text-sm text-slate-300">
                <p>Venue: {event.venue}</p>
                <p>Organizer: {event.organizer}</p>
                <p>Seats left: {event.maxParticipants - event.registeredUsers.length}</p>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button onClick={() => handleRegister(event._id)} className="rounded bg-cyan-500 px-4 py-2 text-sm font-semibold text-white">Register</button>
                <Link to={`/events/${event._id}`} className="rounded border border-cyan-500 px-4 py-2 text-sm text-cyan-400">View details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventsPage;
