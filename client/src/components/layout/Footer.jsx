import { Link } from 'react-router-dom';
import { IoTrainOutline, IoAirplaneOutline, IoBusOutline, IoLogoGithub } from 'react-icons/io5';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-dark-900/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-display font-bold">Y</span>
              </div>
              <span className="font-display font-bold text-text-primary">YatraBook</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed">
              India's smart travel platform. Book trains, flights, and buses with intelligent recommendations.
            </p>
          </div>

          {/* Travel */}
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Travel</h4>
            <ul className="space-y-2.5">
              <li><Link to="/trains" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary-400 transition-colors"><IoTrainOutline size={14} /> Trains</Link></li>
              <li><Link to="/flights" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary-400 transition-colors"><IoAirplaneOutline size={14} /> Flights</Link></li>
              <li><Link to="/buses" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary-400 transition-colors"><IoBusOutline size={14} /> Buses</Link></li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Account</h4>
            <ul className="space-y-2.5">
              <li><Link to="/login" className="text-sm text-text-muted hover:text-primary-400 transition-colors">Login</Link></li>
              <li><Link to="/signup" className="text-sm text-text-muted hover:text-primary-400 transition-colors">Sign Up</Link></li>
              <li><Link to="/dashboard" className="text-sm text-text-muted hover:text-primary-400 transition-colors">Dashboard</Link></li>
            </ul>
          </div>

          {/* Project */}
          <div>
            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-4">Project</h4>
            <ul className="space-y-2.5">
              <li><span className="text-sm text-text-muted">Built with React + Node.js</span></li>
              <li><span className="text-sm text-text-muted">MongoDB + Express</span></li>
              <li><span className="text-sm text-text-muted">Tailwind CSS</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} YatraBook. Built by Gaurav.
          </p>
          <p className="text-xs text-text-muted">
            A full-stack travel booking platform demo
          </p>
        </div>
      </div>
    </footer>
  );
}
