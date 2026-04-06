import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function BattlesPage() {
    const [battle, setBattle] = useState(null);
    const [myBattle, setMyBattle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('');
    const { language } = useAuth();

    useEffect(() => {
        fetchNextBattle();
        fetchMyBattleStatus();
    }, []);

    const fetchNextBattle = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/battles/vote`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('glowr_token')}` }
            });
            setBattle(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMyBattleStatus = async () => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/battles/status`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('glowr_token')}` }
            });
            setMyBattle(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleVote = async (winner) => {
        if (!battle) return;
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/battles/submit`, {
                battleId: battle._id,
                winner
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('glowr_token')}` }
            });
            setStatus(language === 'hi' ? 'वोट दर्ज हो गया!' : 'Vote Cast!');
            setTimeout(() => {
                setStatus('');
                fetchNextBattle();
            }, 1000);
        } catch (err) {
            alert('Voting failed');
        }
    };

    const handleJoin = async () => {
        try {
            await axios.post(`${import.meta.env.VITE_API_URL}/api/battles/join`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('glowr_token')}` }
            });
            alert(language === 'hi' ? 'आप अखाड़े में शामिल हो गए हैं!' : 'You joined the arena!');
            fetchMyBattleStatus();
        } catch (err) {
            alert(err.response?.data?.message || 'Joining failed');
        }
    };

    return (
        <div className="page-container">
            <motion.div
                className="battles-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>{language === 'hi' ? '⚔️ स्टाइल अखाड़ा' : '⚔️ Style Arena'}</h1>
                <p>{language === 'hi' ? 'सर्वश्रेष्ठ लुक को वोट दें या चुनौती में शामिल हों!' : 'Vote for the best look or join the challenge!'}</p>
                {!myBattle ? (
                    <button className="btn-primary join-btn" onClick={handleJoin}>
                        {language === 'hi' ? '✦ अखाड़े में शामिल हों' : '✦ Enter the Arena'}
                    </button>
                ) : (
                    <div className="my-battle-status">
                        <div className="status-badge animated">● {language === 'hi' ? 'आपका मैच जारी है' : 'Your Match Active'}</div>
                        <div className="status-score">
                            {myBattle.userA.userId === localStorage.getItem('glowr_user_id')
                                ? myBattle.userA.votes
                                : (myBattle.userB?.votes || 0)} {language === 'hi' ? 'वोट' : 'Votes'}
                        </div>
                        {(!myBattle.userB?.userId) && <p className="match-wait">{language === 'hi' ? 'प्रतिद्वंद्वी की तलाश है...' : 'Searching for opponent...'}</p>}
                    </div>
                )}
            </motion.div>

            <div className="battles-arena">
                {loading ? (
                    <div className="loading-text">Finding warriors...</div>
                ) : battle ? (
                    <div className="battle-arena-content">
                        <AnimatePresence mode="wait">
                            <motion.div
                                className="battle-vs-container"
                                key={battle._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                            >
                                <div className="battle-player card-a" onClick={() => handleVote('A')}>
                                    <div className="player-img-wrapper">
                                        <img src={battle.userA.imageUrl} alt="Style A" />
                                    </div>
                                    <div className="vote-label">Style A</div>
                                </div>

                                <div className="vs-badge">VS</div>

                                <div className="battle-player card-b" onClick={() => handleVote('B')}>
                                    <div className="player-img-wrapper">
                                        <img src={battle.userB.imageUrl} alt="Style B" />
                                    </div>
                                    <div className="vote-label">Style B</div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                        {status && <div className="vote-success-toast">{status}</div>}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">🎖️</div>
                        <h3>{language === 'hi' ? 'अभी कोई अखाड़ा सक्रिय नहीं है' : 'No active battles found'}</h3>
                        <p>{language === 'hi' ? 'वापस आएं जब अधिक योद्धा शामिल हों!' : 'Check back when more style warriors join!'}</p>
                        <button className="btn-secondary" onClick={fetchNextBattle}>Refresh</button>
                    </div>
                )}
            </div>
        </div>
    );
}
