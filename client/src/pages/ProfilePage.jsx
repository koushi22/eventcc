import { useEffect, useState } from 'react';
import api from '../services/api';

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const fetchProfile = async () => {
    const res = await api.get('/users/profile');
    setProfile(res.data);
    setName(res.data.user.name);
    setEmail(res.data.user.email);
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/users/profile', { name, email });
    fetchProfile();
  };

  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h1 className="text-3xl font-semibold">Profile</h1>
        <p className="mt-2 text-slate-400">Keep your account details up to date.</p>

        <div className="mt-8 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <p className="text-sm text-slate-400">Name</p>
            <p className="mt-1 text-xl font-semibold">{profile.user.name}</p>
            <p className="mt-4 text-sm text-slate-400">Email</p>
            <p className="mt-1 text-xl font-semibold">{profile.user.email}</p>
            <div className="mt-6 grid gap-3">
              <div className="rounded-lg bg-slate-800 p-3">
                <p className="text-sm text-slate-400">Events created</p>
                <p className="text-lg font-semibold">{profile.createdEventsCount}</p>
              </div>
              <div className="rounded-lg bg-slate-800 p-3">
                <p className="text-sm text-slate-400">Events registered</p>
                <p className="text-lg font-semibold">{profile.registeredEventsCount}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/50 p-6">
            <input className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} />
            <button className="rounded bg-cyan-500 px-4 py-2 font-semibold text-white">Save profile</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
