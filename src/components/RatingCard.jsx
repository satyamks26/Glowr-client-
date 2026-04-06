import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RatingCard({ result, previewUrl }) {
    const { language } = useAuth();
    const [displayRating, setDisplayRating] = useState(0);
    const [checkedTips, setCheckedTips] = useState([]);
    const targetRating = result?.rating || 0;

    useEffect(() => {
        setDisplayRating(0);
        const duration = 1500;
        const steps = 60;
        const increment = targetRating / steps;
        let current = 0;
        const timer = setInterval(() => {
            current += increment;
            if (current >= targetRating) {
                setDisplayRating(targetRating);
                clearInterval(timer);
            } else {
                setDisplayRating(parseFloat(current.toFixed(1)));
            }
        }, duration / steps);
        return () => clearInterval(timer);
    }, [targetRating]);

    const toggleTip = (i) => {
        setCheckedTips((prev) =>
            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
        );
    };

    const getScoreColor = (score) => {
        if (score >= 8) return '#22c55e';
        if (score >= 6) return '#f59e0b';
        if (score >= 4) return '#f97316';
        return '#ef4444';
    };

    const getScoreLabel = (score) => {
        if (language === 'hi') {
            if (score >= 8.5) return 'उत्कृष्ट';
            if (score >= 7) return 'बहुत बढ़िया';
            if (score >= 5.5) return 'अच्छा';
            if (score >= 4) return 'ठीक-ठाक';
            return 'सुधार की जरूरत';
        }
        if (score >= 8.5) return 'Excellent';
        if (score >= 7) return 'Great';
        if (score >= 5.5) return 'Good';
        if (score >= 4) return 'Fair';
        return 'Needs Work';
    };

    const circumference = 2 * Math.PI * 54;
    const progress = (targetRating / 10) * circumference;

    const strengths = language === 'hi' ? (result?.strengthsHindi || result?.strengths) : result?.strengths;
    const tips = language === 'hi' ? (result?.tipsHindi || result?.tips) : result?.tips;

    return (
        <div className="rating-card">
            <div className="rating-card-top">
                {previewUrl && (
                    <div className="result-photo">
                        <img src={previewUrl} alt="Analyzed photo" />
                    </div>
                )}
                <div className="score-section">
                    <div className="score-circle-wrapper">
                        <svg width="130" height="130" viewBox="0 0 130 130">
                            <circle cx="65" cy="65" r="54" fill="none" stroke="#2a2a3e" strokeWidth="10" />
                            <circle
                                cx="65"
                                cy="65"
                                r="54"
                                fill="none"
                                stroke={getScoreColor(targetRating)}
                                strokeWidth="10"
                                strokeDasharray={`${progress} ${circumference}`}
                                strokeLinecap="round"
                                transform="rotate(-90 65 65)"
                                style={{ transition: 'stroke-dasharray 1.5s ease-out' }}
                            />
                        </svg>
                        <div className="score-text">
                            <span className="score-number" style={{ color: getScoreColor(targetRating) }}>
                                {displayRating.toFixed(1)}
                            </span>
                            <span className="score-out-of">/10</span>
                        </div>
                    </div>
                    <div className="score-label" style={{ color: getScoreColor(targetRating) }}>
                        {getScoreLabel(targetRating)}
                    </div>
                    <div className={`ai-badge ${result?.isAI ? 'ai-detected' : 'ai-real'}`}>
                        {result?.isAI
                            ? (language === 'hi' ? '✦ एआई जनित छवि' : '✦ AI Generated Image')
                            : (language === 'hi' ? '📷 वास्तविक छवि' : '📷 Real Image')}
                    </div>
                    {result?.persona && (
                        <div className="persona-badge">
                            <span className="persona-label">{language === 'hi' ? 'स्टाइल व्यक्तित्व:' : 'Style Persona:'}</span>
                            <span className="persona-val">{language === 'hi' ? result.personaHindi : result.persona}</span>
                        </div>
                    )}
                    {result?.qualityScore !== undefined && (
                        <div className="quality-badge" style={{ color: getScoreColor(result.qualityScore) }}>
                            <span className="quality-label">{language === 'hi' ? 'फोटो गुणवत्ता:' : 'Photo Quality:'}</span>
                            <span className="quality-val">{result.qualityScore.toFixed(1)}/10</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="rating-card-body">
                {(result?.colorPalette?.length > 0 || result?.celebTwin) && (
                    <div className="premium-features-row">
                        {result.colorPalette?.length > 0 && (
                            <div className="feature-item color-palette-box">
                                <h5>{language === 'hi' ? '🎨 सुझाये गए रंग' : '🎨 Power Colors'}</h5>
                                <p className="feature-subtext">
                                    {language === 'hi'
                                        ? 'ये रंग आपके कपड़ों और एक्सेसरीज के लिए सबसे अच्छे हैं जो आपकी स्किन टोन को निखारते हैं।'
                                        : 'These colors are best for your clothing & accessories to complement your skin tone.'}
                                </p>
                                <div className="palette-colors">
                                    {result.colorPalette.map((color, i) => (
                                        <div
                                            key={i}
                                            className="color-dot"
                                            style={{ backgroundColor: color }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}
                        {result.celebTwin && (
                            <div className="feature-item celeb-twin-box">
                                <h5>{language === 'hi' ? '🌟 स्टाइल ट्विन' : '🌟 Style Twin'}</h5>
                                <p className="celeb-name">{result.celebTwin}</p>
                            </div>
                        )}
                    </div>
                )}

                {strengths?.length > 0 && (
                    <div className="feedback-section">
                        <h4>{language === 'hi' ? '✅ आपकी खूबियां' : '✅ Your Strengths'}</h4>
                        <ul className="strengths-list">
                            {strengths.map((s, i) => (
                                <li key={i}>{s}</li>
                            ))}
                        </ul>
                    </div>
                )}

                {tips?.length > 0 && (
                    <div className="feedback-section">
                        <h4>{language === 'hi' ? '💡 सुधार के सुझाव' : '💡 Improvement Tips'}</h4>
                        <p className="tips-subtitle">
                            {language === 'hi'
                                ? 'हर सुझाव को पूरा करने के बाद टिक करें, फिर नए स्कोर के लिए फिर से अपलोड करें!'
                                : 'Check off each tip as you follow it, then re-upload for a new score!'}
                        </p>
                        <ul className="tips-list">
                            {tips.map((tip, i) => (
                                <li
                                    key={i}
                                    className={`tip-item ${checkedTips.includes(i) ? 'checked' : ''}`}
                                    onClick={() => toggleTip(i)}
                                >
                                    <span className="tip-checkbox">{checkedTips.includes(i) ? '✓' : ''}</span>
                                    <span className="tip-text">{tip}</span>
                                </li>
                            ))}
                        </ul>
                        {checkedTips.length === tips.length && tips.length > 0 && (
                            <div className="all-done-msg">
                                {language === 'hi'
                                    ? '🎉 सभी सुझाव पूरे हुए! अपना बेहतर स्कोर देखने के लिए फोटो फिर से अपलोड करें।'
                                    : '🎉 All tips completed! Re-upload your photo to see your improved score.'}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
