import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../hooks/useAuth.js';

const scriptId = 'google-identity-services';

const GoogleSignInButton = ({ onError, onSuccess }) => {
  const buttonRef = useRef(null);
  const { loginWithGoogle } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('Missing VITE_GOOGLE_CLIENT_ID env variable; Google sign-in disabled.');
      return;
    }

    const handleCredential = async (response) => {
      if (!response?.credential) {
        onError?.(new Error('Missing Google credential response'));
        return;
      }
      try {
        const data = await loginWithGoogle(response.credential);
        onSuccess?.(data);
      } catch (error) {
        onError?.(error);
      }
    };

    const renderButton = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return;
      }
      window.google.accounts.id.initialize({ client_id: clientId, callback: handleCredential });
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'outline',
        size: 'large',
        width: 320,
        shape: 'pill',
        text: 'signin_with'
      });
      setReady(true);
    };

    const ensureScript = () => {
      const existingScript = document.getElementById(scriptId);
      if (existingScript) {
        if (window.google?.accounts?.id) {
          renderButton();
        } else {
          existingScript.addEventListener('load', renderButton, { once: true });
        }
        return;
      }

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = renderButton;
      script.onerror = () => {
        onError?.(new Error('Failed to load Google Sign-In script'));
      };
      document.head.appendChild(script);
    };

    ensureScript();
  }, [loginWithGoogle, onError]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div ref={buttonRef} className="flex justify-center" />
      {!ready ? <p className="text-xs text-slate-400">Google sign-in loading…</p> : null}
    </div>
  );
};

GoogleSignInButton.propTypes = {
  onError: PropTypes.func,
  onSuccess: PropTypes.func
};

GoogleSignInButton.defaultProps = {
  onError: undefined,
  onSuccess: undefined
};

export default GoogleSignInButton;
