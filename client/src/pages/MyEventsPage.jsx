import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

const MyEventsPage = () => {
  const [data, setData] = useState({ createdEvents: [], registeredEvents: [] });

  const fetchMyEvents = async () => {
    const res = await api.get('/events/my-events');
    setData(res.data);
  };

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const handleDelete = async (id) => {
    await api.delete(`/events/${id}`);
    fetchMyEvents();
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-3xl font-semibold">My events</h1>
      <p className="mt-2 text-slate-400">Track your created and registered events in one place.</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Created events</h2>
          <div className="mt-4 space-y-3">
            {data.createdEvents.map((event) => (
              <div key={event._id} className="rounded-lg border border-slate-800 bg-slate-900 p-3">
                {event.bannerImage && (
                  <img
                    src={event.bannerImage}
                    alt={`${event.title} banner`}
                    className="mb-3 h-32 w-full rounded-xl object-cover"
                  />
                )}
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-slate-400">{event.date} • {event.venue}</p>
                <div className="mt-2 flex gap-2">
                  <Link to={`/edit-event/${event._id}`} className="text-sm text-cyan-400">Edit</Link>
                  <button onClick={() => handleDelete(event._id)} className="text-sm text-rose-400">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Registered events</h2>
          <div className="mt-4 space-y-3">
            {data.registeredEvents.map((event) => (
              <div key={event._id} className="rounded-lg border border-slate-800 p-3">
                <p className="font-medium">{event.title}</p>
                <p className="text-sm text-slate-400">{event.date} • {event.venue}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyEventsPage;
