import React, { useState } from 'react';
import { useMusic } from '../context/MusicContext';
import {
  X,
  Mail,
  Lock,
  User,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Phone
} from 'lucide-react';

export const AuthModal = () => {
  const {
    showAuthModal,
    setShowAuthModal,
    pendingOtpPhone,
    setPendingOtpPhone,
    generatedOtpCode,
    signInWithGoogle,
    signInWithEmail,
    signInWithApple,
    sendWhatsAppOtp,
    verifyWhatsAppOtp
  } = useMusic();

  const [activeTab, setActiveTab] = useState('options'); // 'options' | 'google' | 'email' | 'apple'
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneInput, setPhoneInput] = useState('');
  const [otpInput, setOtpInput] = useState('');

  // Email form state
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);

  // Google form state
  const [googleEmail, setGoogleEmail] = useState('');
  const [googleName, setGoogleName] = useState('');

  // Apple form state
  const [appleEmail, setAppleEmail] = useState('');
  const [appleName, setAppleName] = useState('');

  if (!showAuthModal) return null;

  const handleClose = () => {
    setShowAuthModal(false);
    setActiveTab('options');
  };

  return (
    <div className="auth-modal-root fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div
        className="relative w-full max-w-md rounded-3xl bg-gradient-to-b from-[#231942] via-[#1a1233] to-[#120c24] border-2 border-amber-400/50 shadow-2xl p-6 md:p-7 max-h-[92vh] overflow-y-auto"
        style={{ color: '#FFFFFF' }}
      >
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-colors cursor-pointer"
          style={{ color: '#FFFFFF' }}
          title="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Brand Orb & Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className="w-16 h-16 rounded-full p-1 bg-gradient-to-tr from-amber-300 via-amber-500 to-amber-700 shadow-lg shadow-amber-500/30 mb-3">
            <img
              src="/logo.png"
              alt="Happy Shambala"
              className="w-full h-full rounded-full object-cover border border-white"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          </div>
          <h2
            className="font-heading font-black text-xl md:text-2xl"
            style={{ color: '#FACC15' }}
          >
            Welcome to Happy Shambala
          </h2>
          <p
            className="text-[11px] font-extrabold tracking-widest uppercase mt-0.5"
            style={{ color: '#FEF08A' }}
          >
            Awakening Avadhanies
          </p>
          <p
            className="text-xs font-medium mt-1.5 max-w-xs leading-relaxed"
            style={{ color: '#F1F5F9' }}
          >
            Sign in to sync your devotional streak, favorites & personalized chanting analytics
          </p>
          <div
            className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/60 text-[11px] font-extrabold"
            style={{ color: '#FDE047' }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: '#FACC15' }} />
            <span>100% Free Forever • No Subscriptions Required</span>
          </div>
        </div>

        {activeTab === 'options' && (
          <div className="space-y-3">
            {/* 1. Sign in with Google */}
            <button
              onClick={() => setActiveTab('google')}
              className="w-full py-3.5 px-4 rounded-2xl bg-white hover:bg-slate-100 font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
              style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
            >
              <span
                className="w-7 h-7 rounded-full bg-gradient-to-b from-red-500 to-red-600 font-black text-xs flex items-center justify-center shadow"
                style={{ color: '#FFFFFF' }}
              >
                G
              </span>
              <span style={{ color: '#0F172A' }}>Sign in with Google</span>
            </button>

            {/* 2. Sign in with Email */}
            <button
              onClick={() => setActiveTab('email')}
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 border border-blue-400/50 font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
              style={{ color: '#FFFFFF' }}
            >
              <span
                className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shadow"
                style={{ color: '#FFFFFF' }}
              >
                <Mail className="w-3.5 h-3.5" style={{ color: '#FFFFFF' }} />
              </span>
              <span style={{ color: '#FFFFFF' }}>Sign in with Email</span>
            </button>

            {/* 3. Sign in with Apple */}
            <button
              onClick={() => setActiveTab('apple')}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#0F172A] hover:bg-[#1E293B] border border-slate-400/50 font-extrabold text-sm flex items-center justify-center gap-3 shadow-lg transition-all cursor-pointer"
              style={{ color: '#FFFFFF' }}
            >
              <span
                className="w-7 h-7 rounded-full bg-white/15 font-black text-base flex items-center justify-center"
                style={{ color: '#FFFFFF' }}
              >
                
              </span>
              <span style={{ color: '#FFFFFF' }}>Sign in with Apple ID</span>
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 py-2">
              <div className="h-px bg-white/25 flex-1" />
              <span
                className="text-[11px] font-extrabold tracking-widest uppercase"
                style={{ color: '#E2E8F0' }}
              >
                OR WHATSAPP / PHONE OTP
              </span>
              <div className="h-px bg-white/25 flex-1" />
            </div>

            {/* 4. WhatsApp / Phone OTP Section */}
            {!pendingOtpPhone ? (
              <div className="space-y-3">
                <div
                  className="flex items-center rounded-2xl border-2 border-amber-400/60 overflow-hidden shadow-inner"
                  style={{ backgroundColor: '#FFFFFF' }}
                >
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="font-extrabold text-xs px-3 py-3.5 border-r border-slate-300 outline-none cursor-pointer"
                    style={{ backgroundColor: '#FFFBEB', color: '#B45309' }}
                  >
                    <option value="+91" style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>🇮🇳 +91</option>
                    <option value="+1" style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>🇺🇸 +1</option>
                    <option value="+44" style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>🇬🇧 +44</option>
                    <option value="+971" style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}>🇦🇪 +971</option>
                  </select>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="Enter phone / WhatsApp number"
                    className="flex-1 px-3.5 py-3 text-sm font-bold placeholder-slate-500 outline-none"
                    style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                  />
                </div>

                <button
                  onClick={() => sendWhatsAppOtp(`${countryCode}${phoneInput}`)}
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 border border-emerald-400/50 font-extrabold text-sm flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer"
                  style={{ color: '#FFFFFF' }}
                >
                  <MessageSquare className="w-4 h-4" style={{ color: '#FFFFFF' }} />
                  <span style={{ color: '#FFFFFF' }}>Send OTP via WhatsApp</span>
                </button>
                <p
                  className="text-[11px] text-center font-bold"
                  style={{ color: '#6EE7B7' }}
                >
                  💬 Instant 6-digit verification code sent via WhatsApp
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-[#161129] border border-emerald-400/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-xs font-extrabold flex items-center gap-1.5"
                    style={{ color: '#6EE7B7' }}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Enter WhatsApp OTP
                  </span>
                  <button
                    onClick={() => setPendingOtpPhone('')}
                    className="text-[11px] underline cursor-pointer"
                    style={{ color: '#FDE047' }}
                  >
                    Edit Number
                  </button>
                </div>
                <p className="text-xs" style={{ color: '#F1F5F9' }}>
                  Sent via WhatsApp to <span className="font-bold" style={{ color: '#FFFFFF' }}>{pendingOtpPhone}</span>
                  {generatedOtpCode && (
                    <span
                      className="ml-2 px-2 py-0.5 rounded bg-emerald-500/25 font-mono text-[11px] font-bold"
                      style={{ color: '#A7F3D0' }}
                    >
                      Code: {generatedOtpCode}
                    </span>
                  )}
                </p>
                <input
                  type="text"
                  maxLength={6}
                  value={otpInput}
                  onChange={(e) => setOtpInput(e.target.value)}
                  placeholder="123456"
                  className="w-full text-center font-black text-xl tracking-[0.5em] py-2.5 rounded-xl outline-none border-2 border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
                <button
                  onClick={() => verifyWhatsAppOtp(otpInput || generatedOtpCode)}
                  className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 font-black text-sm transition-all cursor-pointer"
                  style={{ color: '#0F172A' }}
                >
                  Verify & Sign In
                </button>
              </div>
            )}

            {/* Skip / Guest Mode */}
            <div className="pt-2 text-center">
              <button
                onClick={handleClose}
                className="text-xs font-extrabold inline-flex items-center gap-1 cursor-pointer hover:underline"
                style={{ color: '#FDE047' }}
              >
                <span>Skip & Continue as Guest</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* Google Account Sync Sub-View */}
        {activeTab === 'google' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="font-heading font-extrabold text-base flex items-center gap-2"
                style={{ color: '#FFFFFF' }}
              >
                <span
                  className="w-6 h-6 rounded-full bg-red-600 text-xs font-black flex items-center justify-center"
                  style={{ color: '#FFFFFF' }}
                >
                  G
                </span>
                Sync Your Google Account
              </h3>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs font-bold hover:underline cursor-pointer"
                style={{ color: '#FACC15' }}
              >
                ← Back
              </button>
            </div>
            <p className="text-xs" style={{ color: '#E2E8F0' }}>
              Enter your Google email address to sync your devotional profile & chanting stats.
            </p>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Google Email Address</label>
                <input
                  type="email"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  placeholder="yourname@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Your Name (Optional)</label>
                <input
                  type="text"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <button
                onClick={() =>
                  signInWithGoogle({
                    email: googleEmail || 'devotee@gmail.com',
                    name: googleName
                  })
                }
                className="w-full py-3.5 rounded-2xl bg-red-600 hover:bg-red-500 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
                style={{ color: '#FFFFFF' }}
              >
                Confirm & Sync Google Account
              </button>
            </div>
          </div>
        )}

        {/* Email Sign In / Sign Up Sub-View */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="font-heading font-extrabold text-base flex items-center gap-2"
                style={{ color: '#FFFFFF' }}
              >
                <Mail className="w-4 h-4 text-blue-400" />
                {isSignUp ? 'Create Account with Email' : 'Sign in with Email'}
              </h3>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs font-bold hover:underline cursor-pointer"
                style={{ color: '#FACC15' }}
              >
                ← Back
              </button>
            </div>

            <div className="space-y-3">
              {isSignUp && (
                <div>
                  <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Devotional Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                    style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                  />
                </div>
              )}
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Email Address</label>
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Password</label>
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <button
                onClick={() => signInWithEmail(emailInput, passwordInput, nameInput)}
                className="w-full py-3.5 rounded-2xl bg-blue-600 hover:bg-blue-500 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
                style={{ color: '#FFFFFF' }}
              >
                {isSignUp ? 'Create Account & Sign In' : 'Sign In'}
              </button>
              <div className="text-center pt-1">
                <button
                  onClick={() => setIsSignUp(!isSignUp)}
                  className="text-xs font-bold hover:underline cursor-pointer"
                  style={{ color: '#FDE047' }}
                >
                  {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Create one"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Apple ID Sub-View */}
        {activeTab === 'apple' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3
                className="font-heading font-extrabold text-base flex items-center gap-2"
                style={{ color: '#FFFFFF' }}
              >
                <span></span>
                Sign in with Apple ID
              </h3>
              <button
                onClick={() => setActiveTab('options')}
                className="text-xs font-bold hover:underline cursor-pointer"
                style={{ color: '#FACC15' }}
              >
                ← Back
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Apple ID / iCloud Email</label>
                <input
                  type="email"
                  value={appleEmail}
                  onChange={(e) => setAppleEmail(e.target.value)}
                  placeholder="yourname@icloud.com"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <div>
                <label className="block text-xs font-bold mb-1" style={{ color: '#F1F5F9' }}>Your Name (Optional)</label>
                <input
                  type="text"
                  value={appleName}
                  onChange={(e) => setAppleName(e.target.value)}
                  placeholder="e.g. Ananya Rao"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-amber-400/50 placeholder-slate-500 text-sm font-semibold outline-none focus:border-amber-400"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
                />
              </div>
              <button
                onClick={() =>
                  signInWithApple({
                    email: appleEmail || 'seeker@icloud.com',
                    name: appleName || 'Apple Devotee'
                  })
                }
                className="w-full py-3.5 rounded-2xl bg-white hover:bg-slate-200 font-extrabold text-sm shadow-lg transition-all cursor-pointer"
                style={{ backgroundColor: '#FFFFFF', color: '#0F172A' }}
              >
                Continue with Apple ID
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthModal;

