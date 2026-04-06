import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout, language, toggleLanguage } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                <span className="logo-icon">✦</span> Glowr
            </Link>
            {user && (
                <div className="nav-links">
                    <Link
                        to="/"
                        className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'Analyze' : 'विश्लेषण'}
                    </Link>
                    <Link
                        to="/history"
                        className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'History' : 'इतिहास'}
                    </Link>
                    <Link
                        to="/leaderboard"
                        className={`nav-link ${location.pathname === '/leaderboard' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'Leaderboard' : 'लीडरबोर्ड'}
                    </Link>
                    <Link
                        to="/roadmap"
                        className={`nav-link ${location.pathname === '/roadmap' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'Roadmap' : 'रोडमैप'}
                    </Link>
                    <Link
                        to="/wardrobe"
                        className={`nav-link ${location.pathname === '/wardrobe' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'Wardrobe' : 'वार्डरोब'}
                    </Link>
                    <Link
                        to="/battles"
                        className={`nav-link ${location.pathname === '/battles' ? 'active' : ''}`}
                    >
                        {language === 'en' ? 'Arena' : 'अखाड़ा'}
                    </Link>
                    <button className="btn-lang-toggle" onClick={toggleLanguage}>
                        {language === 'en' ? '🇮🇳 हिंदी' : '🇬🇧 English'}
                    </button>
                    <div className="nav-user">
                        <span className="user-initial">{user.name?.[0]?.toUpperCase() || 'U'}</span>
                        <button className="btn-logout" onClick={handleLogout}>
                            Sign Out
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
}
