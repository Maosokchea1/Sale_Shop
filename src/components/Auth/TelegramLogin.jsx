import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import api from '../../services/api';

const TelegramLogin = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const widgetRef = useRef(null);

  // Bot configuration
  const BOT_ID = '8952801849';
  const BOT_USERNAME = 'ecommerceshop123bot';
  // Use the domain registered with BotFather (without protocol for widget)
  const DOMAIN = 'shophub.loca.lt';
  const ORIGIN = `https://${DOMAIN}`;

  // Method 1: Using Telegram Login Widget (Recommended)
  useEffect(() => {
    // Load Telegram Login Widget script
    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-widget.js?22';
    script.async = true;
    script.setAttribute('data-telegram-login', BOT_USERNAME);
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '8');
    script.setAttribute('data-auth-url', `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/auth/telegram-login`);
    script.setAttribute('data-request-access', 'write');
    
    if (widgetRef.current) {
      widgetRef.current.innerHTML = '';
      widgetRef.current.appendChild(script);
    }

    // Listen for Telegram login response
    window.onTelegramAuth = async (user) => {
      console.log('Telegram user data:', user);
      setIsLoading(true);
      
      try {
        const response = await api.post('/api/auth/telegram-login', user);
        const data = response.data;
        
        // Store user data
        localStorage.setItem('access_token', data.access_token);
        localStorage.setItem('user', JSON.stringify({
          id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          is_admin: data.is_admin,
        }));
        
        setUser({
          id: data.user_id,
          email: data.email,
          full_name: data.full_name,
          is_admin: data.is_admin,
        });
        
        showSuccess(`Welcome ${data.full_name || 'User'}!`);
        navigate('/');
      } catch (error) {
        console.error('Telegram login error:', error);
        showError(error.response?.data?.detail || 'Telegram login failed');
      } finally {
        setIsLoading(false);
      }
    };

    return () => {
      if (widgetRef.current) {
        widgetRef.current.innerHTML = '';
      }
      window.onTelegramAuth = null;
    };
  }, [navigate, setUser, showSuccess, showError]);

  // Method 2: Manual popup login (Alternative if widget doesn't work)
  const handleManualTelegramLogin = () => {
    setIsLoading(true);
    
    const width = 600;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    // OAuth URL
    const authUrl = `https://oauth.telegram.org/auth?bot_id=${BOT_ID}&origin=${ORIGIN}&embed=1&request_access=write`;
    
    console.log('Opening Telegram auth:', authUrl);
    
    const popup = window.open(authUrl, 'Telegram Login', `width=${width},height=${height},left=${left},top=${top}`);
    
    const handleMessage = async (event) => {
      // Only accept messages from telegram.org
      if (event.origin !== 'https://oauth.telegram.org') return;
      
      if (event.data && typeof event.data === 'object') {
        console.log('Telegram auth data received:', event.data);
        
        try {
          const response = await api.post('/api/auth/telegram-login', event.data);
          const data = response.data;
          
          localStorage.setItem('access_token', data.access_token);
          localStorage.setItem('user', JSON.stringify({
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
            is_admin: data.is_admin,
          }));
          
          setUser({
            id: data.user_id,
            email: data.email,
            full_name: data.full_name,
            is_admin: data.is_admin,
          });
          
          showSuccess(`Welcome ${data.full_name || 'User'}!`);
          navigate('/');
        } catch (error) {
          console.error('Telegram login error:', error);
          showError(error.response?.data?.detail || 'Telegram login failed');
        } finally {
          setIsLoading(false);
        }
        
        window.removeEventListener('message', handleMessage);
        if (popup && !popup.closed) popup.close();
      }
    };
    
    window.addEventListener('message', handleMessage);
    
    // Check if popup was closed by user
    const checkClosed = setInterval(() => {
      if (popup && popup.closed) {
        clearInterval(checkClosed);
        setIsLoading(false);
        window.removeEventListener('message', handleMessage);
      }
    }, 500);
  };

  return (
    <div className="space-y-4">
      {/* Telegram Login Widget */}
      <div ref={widgetRef} className="flex justify-center"></div>
      
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">Or</span>
        </div>
      </div>
      
      {/* Manual Login Button (Fallback) */}
      <button
        onClick={handleManualTelegramLogin}
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#2AABEE] text-white rounded-lg font-semibold hover:bg-[#1f8bc9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Connecting to Telegram...</span>
          </div>
        ) : (
          <>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.66-.35-1.02.22-1.61.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.09-.2-.1-.06-.23-.04-.33-.01-.15.04-2.54 1.61-3.37 2.14-.25.16-.48.24-.68.24-.22 0-.45-.08-.66-.15-.42-.15-.89-.31-1.3-.47-.3-.12-.65-.26-.63-.55.01-.2.19-.38.58-.58 2.31-1.23 4.66-2.47 6.56-3.33.77-.35 2.64-1.14 3.15-1.21.15-.02.42-.04.59.15.13.15.14.35.11.54z"/>
            </svg>
            Continue with Telegram
          </>
        )}
      </button>
      
      {/* Note */}
      <p className="text-xs text-center text-gray-400 mt-2">
        By continuing, you agree to share your Telegram profile information
      </p>
    </div>
  );
};

export default TelegramLogin;