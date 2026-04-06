import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
            const payload = isLogin
                ? { email: form.email, password: form.password }
                : { name: form.name, email: form.email, password: form.password };
            const { data } = await api.post(endpoint, payload);
            login(data);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <span className="logo-icon">✦</span>
                    <h1>Glowr</h1>
                    <p>AI-powered appearance rating</p>
                </div>

                <div className="tab-switch">
                    <button
                        className={isLogin ? 'tab active' : 'tab'}
                        onClick={() => { setIsLogin(true); setError(''); }}
                    >
                        Sign In
                    </button>
                    <button
                        className={!isLogin ? 'tab active' : 'tab'}
                        onClick={() => { setIsLogin(false); setError(''); }}
                    >
                        Sign Up
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    {!isLogin && (
                        <div className="form-group">
                            <label>Name</label>
                            <input
                                type="text"
                                placeholder="Your name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                required
                            />
                        </div>
                    )}
                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                            required
                        />
                    </div>

                    {error && <div className="error-msg">{error}</div>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Please wait...' : isLogin ? 'Sign In' : 'Create Account'}
                    </button>
                </form>
            </div>
        </div>
    );
}
