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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Header with icon */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl mb-4 shadow-lg shadow-purple-500/50">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-2">
            ScarEncryption
          </h1>
          <p className="text-slate-400 text-sm">Protect your messages with AES-256 encryption</p>
        </div>

        {/* Main card */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl border border-slate-800/50 shadow-2xl p-6 md:p-8 transition-all duration-300 hover:border-slate-700/50">
          {/* Text input */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Your Message</label>
            <textarea
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onFocus={() => clearError('text')}
              placeholder="Enter text to encrypt or decrypt..."
              className={`w-full h-32 px-4 py-3 bg-slate-800/50 border ${
                errors.text ? 'border-red-500/50' : 'border-slate-700/50'
              } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200 resize-none`}
            />
            {errors.text && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                This field is required
              </p>
            )}
          </div>

          {/* Secret key input */}
          <div className="mb-6">
            <label className="block text-slate-300 text-sm font-medium mb-2">Secret Key</label>
            <input
              type="password"
              value={secretKey}
              onChange={(e) => setSecretKey(e.target.value)}
              onFocus={() => clearError('key')}
              placeholder="Enter your secret key..."
              className={`w-full px-4 py-3 bg-slate-800/50 border ${
                errors.key ? 'border-red-500/50' : 'border-slate-700/50'
              } rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent transition-all duration-200`}
            />
            {errors.key && (
              <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                <span className="inline-block w-1 h-1 bg-red-400 rounded-full"></span>
                This field is required
              </p>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={encryptText}
              className="group relative px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Lock className="w-4 h-4" />
                Encrypt
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>

            <button
              onClick={decryptText}
              className="group relative px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl font-semibold text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all duration-200 overflow-hidden"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                <Unlock className="w-4 h-4" />
                Decrypt
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-cyan-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
            </button>
          </div>

          {/* Result output */}
          {result && (
            <div className="animate-slide-up">
              <label className="block text-slate-300 text-sm font-medium mb-2">Result</label>
              <div className="relative">
                <textarea
                  value={result}
                  readOnly
                  className="w-full h-32 px-4 py-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-100 font-mono text-sm resize-none focus:outline-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 p-2 bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-all duration-200 group"
                  title="Copy to clipboard"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-slate-400 group-hover:text-slate-200" />
                  )}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Copied to clipboard!
                </p>
              )}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="text-center mt-6 text-slate-500 text-xs">
          <p>Your data is encrypted locally in your browser. Nothing is sent to any server.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slide-up 0.4s ease-out;
        }

        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}