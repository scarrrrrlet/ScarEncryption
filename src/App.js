import React, { useState } from 'react';
import { Lock, Unlock, Copy, Check, Shield } from 'lucide-react';
import CryptoJS from 'crypto-js';

export default function EncryptionTool() {
  const [textInput, setTextInput] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [result, setResult] = useState('');
  const [errors, setErrors] = useState({ text: false, key: false });
  const [copied, setCopied] = useState(false);
  // const [activeMode, setActiveMode] = useState(null);

  const base64Regex = /^[A-Za-z0-9+/]+={0,3}$/;

  const clearError = (field) => {
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const encryptText = () => {
    // setActiveMode('encrypt');
    const newErrors = { text: !textInput, key: !secretKey };
    setErrors(newErrors);

    if (newErrors.text || newErrors.key) {
      setResult('');
      return;
    }

    try {
      const encrypted = CryptoJS.AES.encrypt(textInput, secretKey).toString();
      setResult(encrypted);
    } catch (e) {
      setResult('Encryption failed. Please try again.');
    }
  };

  const decryptText = () => {
    // setActiveMode('decrypt');
    const trimmedText = textInput.trim();
    const newErrors = { text: !trimmedText, key: !secretKey };
    setErrors(newErrors);

    if (newErrors.text || newErrors.key) {
      setResult('');
      return;
    }

    if (!base64Regex.test(trimmedText)) {
      setResult('Invalid Base64 format.');
      return;
    }

    try {
      const decryptedBytes = CryptoJS.AES.decrypt(trimmedText, secretKey);
      const decryptedText = decryptedBytes.toString(CryptoJS.enc.Utf8);

      if (decryptedText) {
        setResult(decryptedText);
      } else {
        setResult('Decryption failed. Invalid key or ciphertext.');
      }
    } catch (e) {
      setResult('Decryption failed. Invalid key or ciphertext.');
    }
  };

  const copyToClipboard = async () => {
    if (!result) return;

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background image - visible and vibrant */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/background.jpg)`,
        }}
      />

      {/* Subtle dark overlay to ensure text readability without hiding the image */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="w-full max-w-2xl relative z-10">
        {/* Header with neon glow effect */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-purple-600/20 backdrop-blur-sm border-2 border-purple-400 rounded-2xl mb-4 shadow-lg shadow-purple-500/50 neon-glow">
            <Shield className="w-10 h-10 text-purple-300" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-2 neon-text">
            ScarEncryption
          </h1>
          <p className="text-purple-300 text-sm tracking-wider uppercase">AES-256 Encryption • Zero Knowledge</p>
        </div>

        {/* Main card with glassmorphism */}
        <div className="bg-black/30 backdrop-blur-xl rounded-3xl border border-purple-500/30 shadow-2xl shadow-purple-500/20 p-6 md:p-8 transition-all duration-300 hover:border-purple-400/50 hover:shadow-purple-500/30">
          {/* Text input */}
          <div className="mb-6">
            <label className="block text-purple-300 text-sm font-semibold mb-2 uppercase tracking-wide">Your Message</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onFocus={() => clearError('text')}
              placeholder="Enter text to encrypt or decrypt..."
              className={`w-full h-32 px-4 py-3 bg-black/40 backdrop-blur-sm border-2 ${errors.text ? 'border-red-500/70 shadow-red-500/20' : 'border-purple-500/30'
                } rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/30 transition-all duration-200 resize-none`}
            />
            {errors.text && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-2 font-semibold">
                <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                This field is required
              </p>
            )}
          </div>

          {/* Secret key input */}
          <div className="mb-6">
            <label className="block text-purple-300 text-sm font-semibold mb-2 uppercase tracking-wide">Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onFocus={() => clearError('key')}
              placeholder="Enter your secret key..."
              className={`w-full px-4 py-3 bg-black/40 backdrop-blur-sm border-2 ${errors.key ? 'border-red-500/70 shadow-red-500/20' : 'border-purple-500/30'
                } rounded-xl text-white placeholder-purple-400/50 focus:outline-none focus:border-purple-400 focus:shadow-lg focus:shadow-purple-500/30 transition-all duration-200`}
            />
            {errors.key && (
              <p className="text-red-400 text-xs mt-2 flex items-center gap-2 font-semibold">
                <span className="inline-block w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse"></span>
                This field is required
              </p>
            )}
          </div>

          {/* Action buttons with neon effect */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={encryptText}
              className="group relative px-6 py-4 bg-purple-600/20 backdrop-blur-sm border-2 border-purple-400 rounded-xl font-bold text-white shadow-lg shadow-purple-500/30 hover:bg-purple-600/30 hover:shadow-xl hover:shadow-purple-400/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 neon-button"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Lock className="w-5 h-5" />
                ENCRYPT
              </span>
            </button>

            <button
              onClick={decryptText}
              className="group relative px-6 py-4 bg-blue-600/20 backdrop-blur-sm border-2 border-blue-400 rounded-xl font-bold text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600/30 hover:shadow-xl hover:shadow-blue-400/50 transform hover:-translate-y-1 hover:scale-105 transition-all duration-200 neon-button-blue"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Unlock className="w-5 h-5" />
                DECRYPT
              </span>
            </button>
          </div>

          {/* Result output */}
          {result && (
            <div className="animate-slide-up">
              <label className="block text-purple-300 text-sm font-semibold mb-2 uppercase tracking-wide">Result</label>
              <div className="relative">
                <textarea
                  value={result}
                  readOnly
                  className="w-full h-32 px-4 py-3 bg-black/50 backdrop-blur-sm border-2 border-purple-500/30 rounded-xl text-purple-100 font-mono text-sm resize-none focus:outline-none selection:bg-purple-500/30"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 p-2.5 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-400/50 rounded-lg transition-all duration-200 group hover:scale-110"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-purple-300 group-hover:text-white" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-2 font-semibold">
                  <Check className="w-3.5 h-3.5" />
                  Copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer note with neon accent */}
        <div className="text-center mt-6 text-purple-400/70 text-xs tracking-wide">
          <p className="flex items-center justify-center gap-2">
            <Lock className="w-3 h-3" />
            <span>End-to-end encrypted • Client-side only • Zero server storage</span>
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes neon-pulse {
          0%, 100% {
            text-shadow: 0 0 10px rgba(168, 85, 247, 0.8),
                         0 0 20px rgba(168, 85, 247, 0.5),
                         0 0 30px rgba(168, 85, 247, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(168, 85, 247, 1),
                         0 0 30px rgba(168, 85, 247, 0.8),
                         0 0 45px rgba(168, 85, 247, 0.5);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }

        .neon-text {
          text-shadow: 0 0 10px rgba(168, 85, 247, 0.8),
                       0 0 20px rgba(168, 85, 247, 0.6),
                       0 0 30px rgba(168, 85, 247, 0.4),
                       0 0 40px rgba(168, 85, 247, 0.2);
          animation: neon-pulse 2s ease-in-out infinite;
        }

        .neon-glow {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.5),
                      0 0 40px rgba(168, 85, 247, 0.3),
                      inset 0 0 20px rgba(168, 85, 247, 0.2);
        }

        .neon-button:hover {
          box-shadow: 0 0 20px rgba(168, 85, 247, 0.6),
                      0 0 40px rgba(168, 85, 247, 0.4),
                      0 10px 30px rgba(168, 85, 247, 0.3);
        }

        .neon-button-blue:hover {
          box-shadow: 0 0 20px rgba(96, 165, 250, 0.6),
                      0 0 40px rgba(96, 165, 250, 0.4),
                      0 10px 30px rgba(96, 165, 250, 0.3);
        }
      `}</style>
    </div>
  );
}
