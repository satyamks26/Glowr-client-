import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function LeaderboardPage() {
    const [leaders, setLeaders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { language } = useAuth();

    useEffect(() => {
        const fetchLeaders = async () => {
            try {
                const res = await api.get('/api/leaderboard');
                setLeaders(res.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchLeaders();
    }, []);

    const getRankIcon = (index) => {
        if (index === 0) return '🥇';
        if (index === 1) return '🥈';
        if (index === 2) return '🥉';
        return `#${index + 1}`;
    };

    return (
        <div className="page-container">
            <motion.div
                className="leaderboard-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>{language === 'hi' ? '🏆 ग्लोबल स्टाइल लीडरबोर्ड' : '🏆 Global Style Leaderboard'}</h1>
                <p>{language === 'hi' ? 'दुनिया भर के सबसे स्टाइलिश लोग!' : 'The most stylish people from around the world!'}</p>
            </motion.div>

            {loading ? (
                <div className="loading-text">Loading legends...</div>
            ) : (
                <div className="leaderboard-list">
                    {leaders.map((leader, i) => (
                        <motion.div
                            key={leader._id}
                            className={`leader-item ${i < 3 ? 'top-three' : ''}`}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div className="leader-rank">{getRankIcon(i)}</div>
                            <img src={leader.imageUrl} alt="Style" className="leader-photo" />
                            <div className="leader-info">
                                <span className="leader-name">{leader.userId?.name || 'Anonymous'}</span>
                                <span className="leader-date">{new Date(leader.createdAt).toLocaleDateString()}</span>
                            </div>
                            <div className="leader-score">
                                <span className="score-val">{leader.rating.toFixed(1)}</span>
                            </div>
                        </motion.div>
                    ))}
                    {leaders.length === 0 && (
                        <div className="empty-state">No leaders yet. Be the first!</div>
                    )}
                </div>
            )}
        </div>
    );
}
