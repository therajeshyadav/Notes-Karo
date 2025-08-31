type UserProfile = {
    name?: string;
    email: string;
    dob?: string;
    provider: "email" | "google";
};

const STORAGE_KEYS = {
    otpByEmail: "otp_by_email",
    token: "auth_token",
    user: "auth_user",
} as const;

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

function base64UrlEncode(input: string): string {
    return btoa(input).replace(/=+$/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function createJwt(_payload: Record<string, unknown>, _expiresInSeconds = 60 * 60): string {
    throw new Error("JWTs are issued by the backend");
}

export function parseJwt(token: string | null): any | null {
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    try {
        const payloadStr = atob(parts[1].replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(payloadStr);
    } catch {
        return null;
    }
}

function readOtpMap(): Record<string, string> {
    try {
        return JSON.parse(localStorage.getItem(STORAGE_KEYS.otpByEmail) || "{}");
    } catch {
        return {};
    }
}

function writeOtpMap(map: Record<string, string>) {
    localStorage.setItem(STORAGE_KEYS.otpByEmail, JSON.stringify(map));
}

export async function requestOtp(email: string, mode: "login" | "signup") {
  try {
    const res = await fetch(`${API_URL}/auth/request-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, mode }),
    });
    const data = await res.json();
    
    if (!res.ok) {
      // Return the specific error message from the backend
      return { 
        success: false, 
        error: data.error || "Failed to send OTP" 
      };
    }
    
    return { success: true };
  } catch (error) {
    console.error('Request OTP error:', error);
    return { 
      success: false, 
      error: "Network error. Please check your connection and try again." 
    };
  }
}


export async function verifyOtp(email: string, otp: string, profile?: Omit<UserProfile, "email" | "provider">): Promise<{ success: boolean; error?: string; token?: string; user?: UserProfile }> {
    try {
        const res = await fetch(`${API_URL}/auth/verify-otp`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, otp, name: profile?.name, dob: profile?.dob })
        });
        const data = await res.json();
        
        if (!res.ok) {
            return { 
                success: false, 
                error: data.error || "OTP verification failed. Please try again." 
            };
        }
        
        localStorage.setItem(STORAGE_KEYS.token, data.token);
        localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(data.user));
        return { success: true, token: data.token, user: data.user };
    } catch (error) {
        console.error('Verify OTP error:', error);
        return { 
            success: false, 
            error: "Network error. Please check your connection and try again." 
        };
    }
}

// auth.ts (frontend)
// src/lib/auth.ts
export async function googleSignIn(): Promise<{ success: boolean; token?: string; error?: string }> {
  if (!(window as any).google || !(window as any).google.accounts) {
    return { success: false, error: "Google API not loaded yet." };
  }

  return new Promise((resolve) => {
    (window as any).google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: async (response: any) => {
        const tokenId = response.credential;
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/google`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ tokenId }),
          });
          const data = await res.json();
          if (!res.ok) return resolve({ success: false, error: data.error });
          localStorage.setItem("auth_token", data.token);
          resolve({ success: true, token: data.token });
        } catch (err) {
          resolve({ success: false, error: "Network error." });
        }
      },
    });

    // Popup login instead of One Tap
    (window as any).google.accounts.id.prompt((notification: any) => {
      if (notification.isNotDisplayed()) resolve({ success: false, error: "Prompt not displayed (webview or mobile view)." });
    });
  });
}





export function getAuthToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.token);
}

export function getCurrentUser(): UserProfile | null {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.user);
        return raw ? (JSON.parse(raw) as UserProfile) : null;
    } catch {
        return null;
    }
}

export function isAuthenticated(): boolean {
    const token = getAuthToken();
    const payload = parseJwt(token);
    if (!payload) return false;
    const now = Math.floor(Date.now() / 1000);
    return typeof payload.exp === "number" && payload.exp > now;
}

export function signOut() {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
}

export type { UserProfile };


