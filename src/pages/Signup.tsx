import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { requestOtp, verifyOtp } from '../lib/auth';
import GoogleLoginButton from './GoogleLoginButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    dob: ''
  });
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailError, setEmailError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    if (fieldErrors[name]) {
      setFieldErrors({
        ...fieldErrors,
        [name]: false
      });
    }
    
    // Clear email error when user starts typing
    if (name === 'email' && emailError) {
      setEmailError('');
    }
  };

  const validateForm = () => {
    const errors: Record<string, boolean> = {};
    
    if (!formData.name.trim()) errors.name = true;
    if (!/^([^\s@]+)@([^\s@]+)\.[^\s@]+$/.test(formData.email)) errors.email = true;
    if (!formData.dob) errors.dob = true;
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setEmailError('');
    
    if (!validateForm()) {
      setError('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtp(formData.email, 'signup');
      if (result.success) {
        setShowOTP(true);
        setError(''); // Clear any previous errors
        setEmailError(''); // Clear email error
        setSuccess('OTP sent to your email successfully!');
      } else {
        // Check if it's an email-specific error
        if (result.error && result.error.includes('No account found for this email')) {
          setEmailError(result.error);
          setFieldErrors({ ...fieldErrors, email: true });
        } else {
          setError(result.error || 'Failed to send OTP');
        }
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
      const result = await verifyOtp(formData.email, otp, {
        name: formData.name,
        dob: formData.dob
      });
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('An error occurred');
    }
    setIsLoading(false);
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setEmailError('');
    setIsLoading(true);
    
    try {
      const result = await requestOtp(formData.email, 'signup');
      if (result.success) {
        setError(''); // Clear error
        setEmailError(''); // Clear email error
        setSuccess('OTP resent successfully!');
      } else {
        // Check if it's an email-specific error
        if (result.error && result.error.includes('No account found for this email')) {
          setEmailError(result.error);
        } else {
          setError(result.error || 'Failed to resend OTP');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
    setIsLoading(false);
  };

  const getFieldClassName = (fieldName: string) => {
    if (fieldErrors[fieldName] || (fieldName === 'email' && emailError)) {
      return 'auth-form-control error';
    }
    return 'auth-form-control';
  };

  return (
    <>
      {googleLoading && (
        <div className="loading-overlay">
          <div className="text-center">
            <div className="loading-spinner"></div>
            <div className="loading-text">Signing up with Google...</div>
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
                  <h1 className="auth-title">Sign up</h1>
                  <p className="text-muted" style={{ fontSize: '14px', marginTop: '8px' }}>
                    Sign up to enjoy the feature of NoteKaro
                  </p>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                {success && <Alert variant="success" className="mb-3">{success}</Alert>}

                <Form onSubmit={showOTP ? handleOTPVerification : handleSubmit}>
                  {!showOTP ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter Your Name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={getFieldClassName('name')}
                        />
                      </Form.Group>

                     <Form.Floating className="mb-3">
                     <Form.Control
                     type="date"
                     name="dob"
                     value={formData.dob}
                     onChange={handleChange}
                     required
                     placeholder="Date of Birth"  
                    className={getFieldClassName('dob')}
                    />
                   <label htmlFor="dob">Date of Birth</label>
                 </Form.Floating>

                      <Form.Group className="mb-4">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter Your Email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={getFieldClassName('email')}
                        />
                        {emailError && (
                          <div className="email-error-container">
                            <div className="email-error-message">
                              <span className="email-error-icon">⚠</span>
                              <span>{emailError}</span>
                            </div>
                          </div>
                        )}
                      </Form.Group>

                      <Button
                        type="submit"
                        className="w-100 auth-btn mb-3"
                        disabled={isLoading}
                      >
                        {isLoading ? 'Sending...' : 'Get OTP'}
                      </Button>
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <p className="text-muted text-center">
                          Enter the OTP sent to {formData.email}
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
                        {isLoading ? 'Verifying...' : 'Sign up'}
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
                    mode="signup" 
                    onError={setError} 
                    onLoading={setGoogleLoading}
                  />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="auth-link">Sign in</Link>
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

export default Signup;
