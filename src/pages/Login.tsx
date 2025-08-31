import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp } from '../lib/auth';
import GoogleLoginButton from './GoogleLoginButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    
    if (fieldErrors.email) {
      setFieldErrors({
        ...fieldErrors,
        email: false
      });
    }
  };

  const validateEmail = () => {
    const emailRegex = /^([^\s@]+)@([^\s@]+)\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    
    setFieldErrors({
      email: !isValid
    });
    
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateEmail()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtp(email, 'login');
      if (result.success) {
        setShowOTP(true);
        setError(''); // Clear any previous errors
        setSuccess('OTP sent to your email successfully!');
      } else {
        // Display the specific error message from backend
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
    setIsLoading(false);
  };

  const handleOTPVerification = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (otp.length < 4) {
      setError('Please enter the OTP sent to your email');
      return;
    }
    
    setIsLoading(true);

    try {
      const result = await verifyOtp(email, otp);
      
      if (result.success) {
        if (keepLoggedIn) {
          localStorage.setItem('keepLoggedIn', 'true');
        } else {
          localStorage.removeItem('keepLoggedIn');
        }
        
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setIsLoading(true);
    
    try {
      const result = await requestOtp(email, 'login');
      if (result.success) {
        setError(''); // Clear error
        setSuccess('OTP resent successfully!');
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
    setIsLoading(false);
  };

  const getFieldClassName = (fieldName: string) => {
    if (fieldErrors[fieldName]) {
      return 'auth-form-control border-danger';
    }
    return 'auth-form-control';
  };

  return (
    <>
      {googleLoading && (
        <div className="loading-overlay">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <div className="loading-text">Signing in with Google...</div>
          </div>
        </div>
      )}
      
      <div className="auth-container">
        {/* Mobile Header */}
        <div className="auth-mobile-header">
          <div className="mobile-auth-logo-section">
            <div className="mobile-auth-logo-circle">
              <div className="mobile-auth-logo-inner"></div>
            </div>
            <h1 className="mobile-auth-app-name">NoteKaro</h1>
          </div>
        </div>

        {/* Left Section - Form */}
        <div className="auth-left-section">
          <div className="w-100" style={{ maxWidth: '400px' }}>
            {/* Desktop Logo */}
            <div className="auth-logo-section">
              <div className="auth-logo-circle">
                <div className="auth-logo-inner"></div>
              </div>
              <h1 className="auth-app-name">NoteKaro</h1>
            </div>

            <Card className="auth-card">
              <Card.Body className="p-0">
                <div className="text-center mb-4">
                  <h1 className="auth-title">Sign in</h1>
                  <p className="text-muted" style={{ fontSize: '14px', marginTop: '8px' }}>
                    Please sign in to continue to your account
                  </p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                <Form onSubmit={showOTP ? handleOTPVerification : handleSubmit}>
                  {!showOTP ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="jonas.kahnwald@gmail.com"
                          value={email}
                          onChange={handleEmailChange}
                          required
                          className={getFieldClassName('email')}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="keepLoggedIn"
                          label="Keep me logged in"
                          checked={keepLoggedIn}
                          onChange={(e) => setKeepLoggedIn(e.target.checked)}
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 auth-btn mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Sign in'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <p className="text-muted text-center">
                          Enter the OTP sent to {email}
                        </p>
                      </div>

                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          placeholder="OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          className="auth-form-control otp-input"
                        />
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 auth-btn mb-2"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Verifying...' : 'Sign in'}
                      </Button>

                      <Button
                        variant="link"
                        className="w-100 p-0"
                        onClick={handleResendOTP}
                        disabled={isLoading}
                        style={{ color: '#1a73e8', fontSize: '14px' }}
                      >
                        Resend OTP
                      </Button>
                    </>
                  )}
                </Form>

                <div className="mt-3 d-flex justify-content-center">
                  <GoogleLoginButton 
                    mode="login" 
                    onError={setError} 
                    onLoading={setGoogleLoading}
                  />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Need an account? </span>
                  <Link to="/signup" className="auth-link">Create one</Link>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* Right Section - Blue Background */}
        <div className="auth-right-section">
          {/* Decorative content can be added here */}
        </div>
      </div>
    </>
  );
};

export default Login;