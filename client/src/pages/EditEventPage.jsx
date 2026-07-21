import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

const EditEventPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    date: '',
    time: '',
    venue: '',
    organizer: '',
    bannerImage: '',
    maxParticipants: 20,
  });

  useEffect(() => {
    api.get(`/events/${id}`).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/events/${id}`, form);
      navigate('/my-events');
    } catch (error) {
      alert(error.response?.data?.message || 'Could not update event');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Edit event</h1>
        <form onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
          <input name="title" required className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Event title" value={form.title} onChange={handleChange} />
          <input name="category" required className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Category" value={form.category} onChange={handleChange} />
          <input name="date" required type="date" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" value={form.date} onChange={handleChange} />
          <input name="time" required type="time" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" value={form.time} onChange={handleChange} />
          <input name="venue" required className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Venue" value={form.venue} onChange={handleChange} />
          <input name="organizer" required className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Organizer" value={form.organizer} onChange={handleChange} />
          <input name="bannerImage" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Banner image URL" value={form.bannerImage} onChange={handleChange} />
          <input name="maxParticipants" required type="number" className="rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Max participants" value={form.maxParticipants} onChange={handleChange} />
          <textarea name="description" required className="min-h-[120px] rounded border border-slate-700 bg-slate-800 px-3 py-2 md:col-span-2" placeholder="Event description" value={form.description} onChange={handleChange} />
          <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-white md:col-span-2">Save changes</button>
        </form>
      </div>
    </div>
  );
};

export default EditEventPage;
