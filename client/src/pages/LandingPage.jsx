import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../services/api';

const categories = ['All', 'Tech', 'Health', 'Education', 'Community', 'Sports'];

const LandingPage = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    api.get('/events').then((res) => setEvents(res.data.slice(0, 3))).catch(() => setEvents([]));
  }, []);

  return (
    <div>
      <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950 px-4 py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="mb-4 inline-block rounded-full border border-cyan-500/40 bg-cyan-500/10 px-3 py-1 text-sm text-cyan-300">Community-first event platform</p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">Discover and join meaningful community events.</h1>
            <p className="mt-6 max-w-xl text-lg text-slate-300"></p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/register" className="rounded bg-cyan-500 px-5 py-3 font-semibold text-white">Get Started</Link>
              <Link to="/events" className="rounded border border-slate-700 px-5 py-3 font-semibold text-slate-100">Browse Events</Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-2xl">
            <h2 className="text-2xl font-semibold">Why organizers love it</h2>
            <ul className="mt-5 space-y-3 text-slate-300">
              <li>• Simple event creation in minutes</li>
              <li>• Clear attendee limits and seat tracking</li>
              <li>• Beautiful dashboard for every user</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-semibold">Featured events</h2>
            <p className="text-slate-400">Explore upcoming events near you.</p>
          </div>
          <Link to="/events" className="text-cyan-400">View all</Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <div key={event._id} className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-lg transition hover:-translate-y-1">
              {event.bannerImage && (
                <img
                  src={event.bannerImage}
                  alt={`${event.title} banner`}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-5">
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-cyan-500/10 px-2 py-1 text-sm text-cyan-300">{event.category}</span>
                  <span className="text-sm text-slate-400">{event.date}</span>
                </div>
                <h3 className="text-xl font-semibold">{event.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{event.description.slice(0, 90)}...</p>
                <div className="mt-4 text-sm text-slate-300">
                  <p>Venue: {event.venue}</p>
                  <p>Seats left: {event.maxParticipants - event.registeredUsers.length}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="text-3xl font-semibold">Popular categories</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {categories.filter((c) => c !== 'All').map((category) => (
            <span key={category} className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-slate-300">{category}</span>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
