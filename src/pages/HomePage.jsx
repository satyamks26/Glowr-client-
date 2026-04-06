import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import api from '../services/api';
import RatingCard from '../components/RatingCard';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
    const [preview, setPreview] = useState(null);
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [scanStep, setScanStep] = useState(0);
    const { language } = useAuth();

    const onDrop = useCallback((acceptedFiles) => {
        const f = acceptedFiles[0];
        if (!f) return;
        setFile(f);
        setResult(null);
        setError('');
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result);
        reader.readAsDataURL(f);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
        maxFiles: 1,
        maxSize: 10 * 1024 * 1024,
    });

    const handleAnalyze = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        setResult(null);
        setScanStep(0);

        // Rotating messages interval
        const interval = setInterval(() => {
            setScanStep(prev => (prev + 1) % 4);
        }, 2000);

        try {
            const formData = new FormData();
            formData.append('photo', file);
            const { data } = await api.post('/api/analyze', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setResult(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Analysis failed. Try again.');
        } finally {
            clearInterval(interval);
            setLoading(false);
        }
    };

    const handleReset = () => {
        setPreview(null);
        setFile(null);
        setResult(null);
        setError('');
    };

    const t = {
        en: {
            heroTitle: "Unlock Your Ultimate Potential",
            heroSub: "The world's most advanced AI style and appearance consultant. Get instant, objective feedback and actionable tips to level up your look.",
            btnAnalyze: "✦ Analyze My Highlights",
            dropText: "Drop your photo to begin the scan",
            dropSub: "or click to browse — High quality JPG/PNG",
            scanning: "✦ DEEP SCAN IN PROGRESS...",
            scanSub: "Analyzing symmetry, styling, and quality metrics",
            scanSteps: [
                "Scanning facial symmetry...",
                "Checking fashion alignment...",
                "Analyzing color harmony...",
                "Finalizing style persona..."
            ],
            reset: "↩ Analyze Another Style",
            tipsTitle: "📸 Pro Tips for Accurate Scoring",
            tips: [
                "Natural lighting is king (face a window)",
                "Solid backgrounds reduce noise",
                "Keep camera at eye-level",
                "Ensure your full outfit is in frame"
            ]
        },
        hi: {
            heroTitle: "अपनी असली क्षमता को अनलॉक करें",
            heroSub: "दुनिया का सबसे उन्नत एआई स्टाइल और लुक सलाहकार। अपने लुक को बेहतर बनाने के लिए तुरंत फीडबैक और सुझाव प्राप्त करें।",
            btnAnalyze: "✦ मेरा विश्लेषण करें",
            dropText: "स्कैन शुरू करने के लिए फोटो यहां डालें",
            dropSub: "या ब्राउज़ करने के लिए क्लिक करें",
            scanning: "✦ डीप स्कैन जारी है...",
            scanSub: "समरूपता, स्टाइलिंग और गुणवत्ता का विश्लेषण",
            scanSteps: [
                "चेहरे की समरूपता को स्कैन किया जा रहा है...",
                "फ़ैशन संरेखण की जाँच हो रही है...",
                "रंग सद्भाव का विश्लेषण किया जा रहा है...",
                "स्टाइल व्यक्तित्व को अंतिम रूप दिया जा रहा है..."
            ],
            reset: "↩ एक और स्टाइल का विश्लेषण करें",
            tipsTitle: "📸 सटीक स्कोर के लिए प्रो टिप्स",
            tips: [
                "प्राकृतिक रोशनी सबसे अच्छी है",
                "सादा बैकग्राउंड चुनें",
                "कैमरा आंखों के स्तर पर रखें",
                "सुनिश्चित करें कि आपका पूरा पहनावा दिख रहा है"
            ]
        }
    }[language];

    return (
        <div className="page-container">
            <div className="page-header">
                <h2>Rate Your Appearance</h2>
                <p>Upload a clear photo and our AI will give you an honest rating with personalized tips.</p>
            </div>

            {!result ? (
                <div className="upload-section">
                    <div
                        {...getRootProps()}
                        className={`dropzone ${isDragActive ? 'active' : ''} ${preview ? 'has-preview' : ''}`}
                    >
                        <input {...getInputProps()} />
                        {preview ? (
                            <div className="preview-container">
                                <img src={preview} alt="Preview" className="preview-img" />
                                <div className="preview-overlay">
                                    <span>Click or drop to change photo</span>
                                </div>
                            </div>
                        ) : (
                            <div className="dropzone-content">
                                <div className="upload-icon-premium">
                                    <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                        <circle cx="12" cy="13" r="4" />
                                    </svg>
                                </div>
                                <p className="dropzone-text">{t.dropText}</p>
                                <p className="dropzone-sub">{t.dropSub}</p>
                            </div>
                        )}
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    {preview && (
                        <div className="upload-actions">
                            {loading && (
                                <motion.div
                                    className="loading-info premium-loading"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                >
                                    <motion.p
                                        key={scanStep}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="loading-main-text"
                                    >
                                        {t.scanSteps[scanStep]}
                                    </motion.p>
                                    <p className="loading-sub-text">{t.scanSub}</p>
                                </motion.div>
                            )}
                            <button
                                className="btn-primary"
                                onClick={handleAnalyze}
                                disabled={loading}
                                id="analyze-btn"
                            >
                                {loading ? (
                                    <span className="loading-state">
                                        <span className="spinner"></span> Analyzing...
                                    </span>
                                ) : (
                                    '✦ Analyze My Appearance'
                                )}
                            </button>
                            <button className="btn-ghost" onClick={handleReset}>
                                Clear
                            </button>
                        </div>
                    )}

                    {loading && (
                        <div className="loading-info">
                            <p>🤖 AI is analyzing your photo... this takes about 5-10 seconds</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="result-section">
                    <RatingCard result={result} previewUrl={preview} />
                    <button className="btn-ghost center-btn" onClick={handleReset}>
                        ↩ Analyze Another Photo
                    </button>
                </div>
            )}

            <div className="tips-section">
                <h3>📸 Photo Tips for Best Results</h3>
                <ul>
                    <li>Use natural lighting — face a window if possible</li>
                    <li>Keep the background simple and uncluttered</li>
                    <li>Face the camera directly at eye level</li>
                    <li>Make sure your face and outfit are both visible</li>
                </ul>
            </div>
        </div>
    );
}
