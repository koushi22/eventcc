import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetailsPage = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  const fetchEvent = async () => {
    const res = await api.get(`/events/${id}`);
    setEvent(res.data);
  };

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
      await api.post(`/events/register-event/${id}`);
      setMessage('Registration successful');
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Registration failed');
    }
  };

  const handleCancel = async () => {
    try {
      await api.delete(`/events/cancel-registration/${id}`);
      setMessage('Registration cancelled');
      fetchEvent();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Cancellation failed');
    }
  };

  if (!event) return <div className="p-10 text-center">Loading...</div>;

  const isRegistered = event.registeredUsers?.some((registeredUser) => registeredUser?.toString() === user?.id || registeredUser?._id?.toString() === user?.id);
  const seatsLeft = event.maxParticipants - event.registeredUsers.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">{event.category}</p>
            <h1 className="mt-2 text-3xl font-semibold">{event.title}</h1>
          </div>
          <Link to="/events" className="text-sm text-cyan-400">Back to events</Link>
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div>
            {event.bannerImage && (
              <div className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-950">
                <img
                  src={event.bannerImage}
                  alt={`${event.title} banner`}
                  className="h-72 w-full object-cover"
                />
              </div>
            )}
            <p className="mt-6 text-slate-300">{event.description}</p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-sm text-slate-400">Date</p>
                <p className="font-medium">{event.date}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-sm text-slate-400">Time</p>
                <p className="font-medium">{event.time}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-sm text-slate-400">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-800/70 p-4">
                <p className="text-sm text-slate-400">Organizer</p>
                <p className="font-medium">{event.organizer}</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-sm text-slate-400">Available seats</p>
            <p className="mt-2 text-4xl font-semibold text-cyan-400">{seatsLeft}</p>
            <p className="mt-4 text-sm text-slate-400">Maximum participants: {event.maxParticipants}</p>
            <div className="mt-6 space-y-3">
              {isRegistered ? (
                <button onClick={handleCancel} className="w-full rounded bg-rose-500 px-4 py-2 font-semibold text-white">Cancel registration</button>
              ) : (
                <button onClick={handleRegister} className="w-full rounded bg-cyan-500 px-4 py-2 font-semibold text-white">Register now</button>
              )}
              <button onClick={() => navigate('/my-events')} className="w-full rounded border border-slate-700 px-4 py-2">View my events</button>
            </div>
            {message && <p className="mt-4 text-sm text-cyan-300">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
