import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="border-b border-slate-800 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link to="/" className="text-xl font-semibold text-cyan-400">Community Event Hub</Link>
        <div className="flex items-center gap-3 text-sm">
          <Link to="/events" className="transition hover:text-cyan-400">Events</Link>
          {user ? (
            <>
              <Link to="/dashboard" className="transition hover:text-cyan-400">Dashboard</Link>
              <Link to="/my-events" className="transition hover:text-cyan-400">My Events</Link>
              <Link to="/profile" className="transition hover:text-cyan-400">Profile</Link>
              <button onClick={handleLogout} className="rounded bg-cyan-500 px-3 py-1.5 font-medium text-white">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded border border-cyan-500 px-3 py-1.5">Login</Link>
              <Link to="/register" className="rounded bg-cyan-500 px-3 py-1.5 font-medium text-white">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
