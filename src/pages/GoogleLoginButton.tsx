import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface GoogleLoginButtonProps {
  mode: "login" | "signup";
  onError?: (error: string) => void;
  onLoading?: (loading: boolean) => void;
}

const GoogleLoginButton = ({ mode, onError, onLoading }: GoogleLoginButtonProps) => {
  const navigate = useNavigate();
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const initializeGoogleButton = () => {
      if ((window as any).google?.accounts?.id && buttonRef.current) {
        try {
          (window as any).google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          (window as any).google.accounts.id.renderButton(
            buttonRef.current,
            { 
              theme: "outline", 
              size: "large",
              width: "100%",
              text: mode === "login" ? "signin_with" : "signup_with"
            }
          );
        } catch (error) {
          console.error('Google Sign-In initialization error:', error);
          if (onError) {
            onError('Google Sign-In is not available. Please check your internet connection.');
          }
        }
      }
    };

    // Check if Google API is already loaded
    if ((window as any).google?.accounts?.id) {
      initializeGoogleButton();
    } else {
      // Wait for Google API to load
      const checkGoogleLoaded = setInterval(() => {
        if ((window as any).google?.accounts?.id) {
          clearInterval(checkGoogleLoaded);
          initializeGoogleButton();
        }
      }, 100);

      return () => clearInterval(checkGoogleLoaded);
    }
  }, []);

  const handleCredentialResponse = async (response: any) => {
    try {
      if (onLoading) onLoading(true);
      console.log("Encoded JWT ID token: " + response.credential);

      const endpoint = mode === "login" ? "/auth/google/login" : "/auth/google/signup";
      const res = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential: response.credential }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorMessage = data.error || `Google ${mode} failed`;
        if (onError) {
          onError(errorMessage);
        } else {
          console.error(`Google ${mode} error:`, errorMessage);
        }
        if (onLoading) onLoading(false);
        return;
      }

      console.log(`User ${mode} successful:`, data);
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("auth_user", JSON.stringify(data.user));
      
      // Keep loading state while navigating
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = `Google ${mode} failed`;
      if (onError) {
        onError(errorMessage);
      } else {
        console.error(`Google ${mode} error:`, err);
      }
      if (onLoading) onLoading(false);
    }
  };

  return <div ref={buttonRef}></div>;
};

export default GoogleLoginButton;
