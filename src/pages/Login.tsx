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
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

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
    
    if (!validateEmail()) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtp(email, 'login');
      if (result.success) {
        setShowOTP(true);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
    setIsLoading(true);
    
    try {
      const result = await requestOtp(email, 'login');
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
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
    <div className="auth-container">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="auth-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h1 className="auth-title">Sign in</h1>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form onSubmit={showOTP ? handleOTPVerification : handleSubmit}>
                  {!showOTP ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          placeholder="Enter your email"
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
                        {isLoading ? 'Sending...' : 'Get OTP'}
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
                          placeholder="Enter OTP"
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
                  <GoogleLoginButton mode="login" onError={setError} />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Don't have an account? </span>
                  <Link to="/signup" className="auth-link">Sign up</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;