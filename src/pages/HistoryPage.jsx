import { useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export default function HistoryPage() {
    const { language } = useAuth();
    const [ratings, setRatings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedRating, setSelectedRating] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        try {
            const { data } = await api.get('/api/history');
            setRatings(data);
        } catch (err) {
            setError(language === 'hi' ? 'इतिहास लोड करने में विफल।' : 'Failed to load history.');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/api/history/${id}`);
            setRatings((prev) => prev.filter((r) => r._id !== id));
        } catch {
            alert(language === 'hi' ? 'मिटाने में विफल।' : 'Failed to delete.');
        }
    };

    const getScoreColor = (score) => {
        if (score >= 8) return '#22c55e';
        if (score >= 6) return '#f59e0b';
        if (score >= 4) return '#f97316';
        return '#ef4444';
    };

    const getBestRating = () => {
        if (!ratings.length) return null;
        return Math.max(...ratings.map((r) => r.rating));
    };

    const getLatestRating = () => ratings[0]?.rating || null;

    const getImprovement = () => {
        if (ratings.length < 2) return null;
        return (ratings[0].rating - ratings[ratings.length - 1].rating).toFixed(1);
    };

    if (loading) return (
        <div className="page-container">
            <p className="loading-text">
                {language === 'hi' ? 'आपका इतिहास लोड हो रहा है...' : 'Loading your history...'}
            </p>
        </div>
    );

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>{language === 'hi' ? 'आपकी प्रगति' : 'Your Progress'}</h2>
                <p>
                    {language === 'hi'
                        ? 'ट्रैक करें कि समय के साथ आपका स्कोर कैसे बेहतर होता है।'
                        : 'Track how your appearance score improves over time.'}
                </p>
            </div>

            {ratings.length > 1 && (
                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-value" style={{ color: getScoreColor(getLatestRating()) }}>
                            {getLatestRating()?.toFixed(1)}
                        </span>
                        <span className="stat-label">{language === 'hi' ? 'नवीनतम स्कोर' : 'Latest Score'}</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-value" style={{ color: '#f5c518' }}>
                            {getBestRating()?.toFixed(1)}
                        </span>
                        <span className="stat-label">{language === 'hi' ? 'सर्वश्रेष्ठ स्कोर' : 'Best Score'}</span>
                    </div>
                    {getImprovement() !== null && (
                        <div className="stat-item">
                            <span
                                className="stat-value"
                                style={{ color: parseFloat(getImprovement()) >= 0 ? '#22c55e' : '#ef4444' }}
                            >
                                {parseFloat(getImprovement()) >= 0 ? '+' : ''}{getImprovement()}
                            </span>
                            <span className="stat-label">{language === 'hi' ? 'कुल बदलाव' : 'Overall Change'}</span>
                        </div>
                    )}
                    <div className="stat-item">
                        <span className="stat-value">{ratings.length}</span>
                        <span className="stat-label">{language === 'hi' ? 'कुल विश्लेषण' : 'Total Analyses'}</span>
                    </div>
                </div>
            )}

            {error && <div className="error-msg">{error}</div>}

            {ratings.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📷</div>
                    <p>
                        {language === 'hi'
                            ? 'अभी तक कोई विश्लेषण नहीं हुआ। शुरू करने के लिए अपनी पहली फोटो अपलोड करें!'
                            : 'No analyses yet. Upload your first photo to get started!'}
                    </p>
                </div>
            )}

            <div className="history-grid">
                {ratings.map((r, index) => {
                    const tips = language === 'hi' ? (r.tipsHindi || r.tips) : r.tips;
                    return (
                        <div
                            key={r._id}
                            className="history-card clickable"
                            onClick={() => setSelectedRating(r)}
                        >
                            <div className="history-card-header">
                                <div className="history-rank">#{ratings.length - index}</div>
                                <span className="history-date">
                                    {new Date(r.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                                        day: 'numeric',
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>

                            <div className="history-body">
                                {r.imageUrl && (
                                    <img
                                        src={r.imageUrl}
                                        alt="Rated photo"
                                        className="history-thumb"
                                    />
                                )}
                                <div className="history-info">
                                    <div
                                        className="history-score"
                                        style={{ color: getScoreColor(r.rating) }}
                                    >
                                        {r.rating.toFixed(1)}<span className="history-score-out">/10</span>
                                    </div>
                                    <div className="history-meta">
                                        <div className={`history-ai-tag ${r.isAI ? 'ai' : 'real'}`}>
                                            {r.isAI ? 'AI' : 'Real'}
                                        </div>
                                        {r.qualityScore !== undefined && (
                                            <div className="history-quality" style={{ color: getScoreColor(r.qualityScore) }}>
                                                Q: {r.qualityScore.toFixed(1)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <button
                                className="btn-delete"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDelete(r._id);
                                }}
                                title={language === 'hi' ? 'मिटाएं' : 'Delete'}
                            >
                                🗑
                            </button>
                        </div>
                    );
                })}
            </div>

            {/* Detailed View Modal */}
            {selectedRating && (
                <div className="modal-overlay" onClick={() => setSelectedRating(null)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedRating(null)}>✕</button>

                        <div className="modal-header">
                            <h3>{language === 'hi' ? 'विस्तृत विश्लेषण' : 'Detailed Analysis'}</h3>
                            <span className="modal-date">
                                {new Date(selectedRating.createdAt).toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
                                    day: 'numeric', month: 'long', year: 'numeric'
                                })}
                            </span>
                        </div>

                        <div className="modal-grid">
                            <div className="modal-photo">
                                <img src={selectedRating.imageUrl} alt="Analysis Result" />
                                <div className={`modal-ai-badge ${selectedRating.isAI ? 'ai' : 'real'}`}>
                                    {selectedRating.isAI
                                        ? (language === 'hi' ? '✦ एआई जनित' : '✦ AI Generated')
                                        : (language === 'hi' ? '📷 वास्तविक' : '📷 Real Image')}
                                </div>
                            </div>

                            <div className="modal-data">
                                <div className="modal-score-box">
                                    <div className="modal-score-item">
                                        <span className="modal-score-val" style={{ color: getScoreColor(selectedRating.rating) }}>
                                            {selectedRating.rating.toFixed(1)}
                                        </span>
                                        <span className="modal-score-label">/ 10 ({language === 'hi' ? 'लुक्स' : 'Looks'})</span>
                                    </div>
                                    {selectedRating.qualityScore !== undefined && (
                                        <div className="modal-score-item secondary">
                                            <span className="modal-score-val" style={{ color: getScoreColor(selectedRating.qualityScore) }}>
                                                {selectedRating.qualityScore.toFixed(1)}
                                            </span>
                                            <span className="modal-score-label">/ 10 ({language === 'hi' ? 'गुणवत्ता' : 'Quality'})</span>
                                        </div>
                                    )}
                                </div>

                                <div className="modal-sections">
                                    <div className="modal-section">
                                        <h4>✅ {language === 'hi' ? 'खूबियां' : 'Strengths'}</h4>
                                        <ul>
                                            {(language === 'hi' ? (selectedRating.strengthsHindi || selectedRating.strengths) : selectedRating.strengths).map((s, i) => (
                                                <li key={i}>{s}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="modal-section">
                                        <h4>✦ {language === 'hi' ? 'सुझाव' : 'Tips'}</h4>
                                        <ul>
                                            {(language === 'hi' ? (selectedRating.tipsHindi || selectedRating.tips) : selectedRating.tips).map((t, i) => (
                                                <li key={i}>{t}</li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
