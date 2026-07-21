import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const DashboardPage = () => {
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({ createdEventsCount: 0, registeredEventsCount: 0 });

  useEffect(() => {
    api.get('/users/profile').then((res) => {
      setStats({ createdEventsCount: res.data.createdEventsCount, registeredEventsCount: res.data.registeredEventsCount });
    });
    api.get('/events').then((res) => setEvents(res.data.slice(0, 4)));
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Hello, {user?.name || 'there'} 👋</h1>
        <p className="mt-2 text-slate-400">Here is a quick overview of your community activity.</p>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Upcoming events</p>
            <p className="text-2xl font-semibold">{events.length}</p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Registered events</p>
            <p className="text-2xl font-semibold">{stats.registeredEventsCount}</p>
          </div>
          <div className="rounded-xl bg-slate-800 p-4">
            <p className="text-sm text-slate-400">Created events</p>
            <p className="text-2xl font-semibold">{stats.createdEventsCount}</p>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/events" className="rounded bg-cyan-500 px-4 py-2 font-semibold text-white">Browse events</Link>
          <Link to="/create-event" className="rounded border border-slate-700 px-4 py-2">Create event</Link>
          <Link to="/my-events" className="rounded border border-slate-700 px-4 py-2">My events</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Upcoming events</h2>
          <div className="mt-4 space-y-3">
            {events.map((event) => (
              <div key={event._id} className="rounded-lg border border-slate-800 p-3">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-slate-400">{event.date} • {event.venue}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Quick tips</h2>
          <ul className="mt-4 space-y-2 text-slate-400">
            <li>• Keep your event details clear and concise.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
