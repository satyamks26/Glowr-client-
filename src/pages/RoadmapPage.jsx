import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function RoadmapPage() {
    const [roadmap, setRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const { language } = useAuth();

    useEffect(() => {
        fetchRoadmap();
    }, []);

    const fetchRoadmap = async () => {
        try {
            const res = await api.get('/api/roadmap');
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerate = async () => {
        setGenerating(true);
        try {
            const res = await api.post('/api/roadmap/generate', {});
            setRoadmap(res.data);
        } catch (err) {
            alert(language === 'hi' ? 'रोडमैप बनाने में विफल' : 'Failed to generate roadmap');
        } finally {
            setGenerating(false);
        }
    };

    const toggleDay = async (dayId) => {
        try {
            const res = await axios.patch(`${import.meta.env.VITE_API_URL}/api/roadmap/check/${dayId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('glowr_token')}` }
            });
            setRoadmap(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const completedCount = roadmap?.days.filter(d => d.completed).length || 0;
    const progress = (completedCount / 30) * 100;

    if (loading) return <div className="loading-text">Loading your path to perfection...</div>;

    return (
        <div className="page-container">
            <motion.div
                className="roadmap-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>{language === 'hi' ? '📅 30-दिवसीय ग्लो-अप योजना' : '📅 30-Day Glow-Up Roadmap'}</h1>
                <p>{language === 'hi' ? 'आपके स्टाइल को अगले स्तर पर ले जाने के लिए 30 कदम।' : '30 steps to take your style to the next level.'}</p>
            </motion.div>

            {!roadmap ? (
                <div className="empty-state">
                    <div className="empty-icon">🎖️</div>
                    <h3>{language === 'hi' ? 'कोई सक्रिय रोडमैप नहीं' : 'No Active Roadmap'}</h3>
                    <p>{language === 'hi' ? 'अपनी नवीनतम रिपोर्ट के आधार पर 30-दिवसीय व्यक्तिगत योजना बनाएं।' : 'Create a personalized 30-day plan based on your latest analysis.'}</p>
                    <button
                        className="btn-primary premium-btn"
                        onClick={handleGenerate}
                        disabled={generating}
                    >
                        {generating ? '✦ Generating...' : (language === 'hi' ? '✦ रोडमैप बनाएं' : '✦ Generate My Roadmap')}
                    </button>
                </div>
            ) : (
                <div className="roadmap-content">
                    <div className="progress-card">
                        <div className="progress-info">
                            <span>{language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}</span>
                            <span>{completedCount} / 30 {language === 'hi' ? 'दिन' : 'Days'}</span>
                        </div>
                        <div className="progress-bar-bg">
                            <motion.div
                                className="progress-bar-fill"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>

                    <div className="roadmap-days-grid">
                        {roadmap.days.map((day) => (
                            <motion.div
                                key={day._id}
                                className={`roadmap-day-card ${day.completed ? 'completed' : ''}`}
                                whileHover={{ scale: 1.02 }}
                                onClick={() => toggleDay(day._id)}
                            >
                                <div className="day-number">Day {day.day}</div>
                                <div className="day-task">
                                    {language === 'hi' ? day.taskHindi : day.task}
                                </div>
                                <div className="day-checkbox">
                                    {day.completed ? '✓' : ''}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
