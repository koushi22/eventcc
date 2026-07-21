import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-slate-950 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
        <h2 className="text-3xl font-semibold">Welcome back</h2>
        <p className="mt-2 text-slate-400">Sign in to your account.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="w-full rounded border border-slate-700 bg-slate-800 px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {message && <p className="text-sm text-rose-400">{message}</p>}
          <button className="w-full rounded bg-cyan-500 py-2 font-semibold text-white">Login</button>
        </form>
        <p className="mt-4 text-sm text-slate-400">
          New here? <Link to="/register" className="text-cyan-400">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
