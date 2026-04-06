import { useState, useEffect, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function WardrobePage() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [garments, setGarments] = useState([]);
    const [result, setResult] = useState(null);
    const { language } = useAuth();

    useEffect(() => {
        fetchGarments();
    }, []);
    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            setFile(selected);
            setPreview(URL.createObjectURL(selected));
        }
    };

    const handleAnalyze = async () => {
        if (!file) return;
        setAnalyzing(true);
        setResult(null);

        const formData = new FormData();
        formData.append('image', file);

        try {
            const res = await api.post('/api/wardrobe/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setResult(res.data);
        } catch (err) {
            alert(language === 'hi' ? 'विश्लेषण विफल रहा' : 'Analysis failed');
        } finally {
            setAnalyzing(false);
        }
    };

    return (
        <div className="page-container">
            <motion.div
                className="wardrobe-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1>{language === 'hi' ? '👗 एआई वार्डरोब एनालाइजर' : '👗 AI Wardrobe Analyzer'}</h1>
                <p>{language === 'hi' ? 'जांचें कि क्या आपके कपड़े आपकी पावर रंगों से मेल खाते हैं।' : 'Check if your clothes match your personal Power Palette.'}</p>
            </motion.div>

            <div className="wardrobe-main">
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''} ${loading ? 'scanning' : ''}`}>
                    <input {...getInputProps()} />
                    {preview ? (
                        <div className="preview-container">
                            <img src={preview} alt="Garment Preview" className="preview-img" />
                            {loading && <div className="scan-line" />}
                        </div>
                    ) : (
                        <div className="dropzone-content">
                            <div className="upload-icon-premium">👕</div>
                            <p>{language === 'hi' ? 'कपड़े का फोटो यहां डालें' : 'Drop clothing photo here'}</p>
                        </div>
                    )}
                </div>

                {preview && (
                    <button className="btn-primary premium-btn" onClick={handleAnalyze} disabled={loading}>
                        {loading ? 'Analyzing...' : (language === 'hi' ? '✦ मैच चेक करें' : '✦ Check Match')}
                    </button>
                )}

                <AnimatePresence>
                    {result && (
                        <motion.div
                            className="garment-result-card"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                        >
                            <div className="match-header">
                                <div className="match-score-circle" style={{ borderColor: result.isMatch ? '#22c55e' : '#ef4444' }}>
                                    <span className="match-score">{result.matchScore}%</span>
                                    <span className="match-label">Match</span>
                                </div>
                                <div className="dominant-color-box">
                                    <div className="color-dot" style={{ backgroundColor: result.dominantColor }} />
                                    <span>{result.dominantColor}</span>
                                </div>
                            </div>
                            <div className="match-analysis">
                                <h3>{result.isMatch ? '✅ Perfect Match!' : '❌ Not Your Best Color'}</h3>
                                <p>{language === 'hi' ? result.analysisHindi : result.analysis}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="garments-history">
                <h2>{language === 'hi' ? 'पिछला विश्लेषण' : 'Past Analyses'}</h2>
                <div className="garments-grid">
                    {garments.map(g => (
                        <motion.div key={g._id} className="garment-thumb-card">
                            <img src={g.imageUrl} alt="Garment" />
                            <div className={`match-badge ${g.isMatch ? 'yes' : 'no'}`}>
                                {g.matchScore}%
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
