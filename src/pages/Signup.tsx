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
  const [fieldErrors, setFieldErrors] = useState<Record<string, boolean>>({});

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
    
    if (!validateForm()) {
      setError('Please fill all fields correctly');
      return;
    }

    setIsLoading(true);

    try {
      const result = await requestOtp(formData.email, 'signup');
      if (result.success) {
        setShowOTP(true);
      } else {
        setError(result.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred');
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
    setIsLoading(true);
    
    try {
      const result = await requestOtp(formData.email, 'signup');
      if (!result.success) {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('An error occurred');
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
                  <h1 className="auth-title">Sign up</h1>
                </div>

                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}

                <Form onSubmit={showOTP ? handleOTPVerification : handleSubmit}>
                  {!showOTP ? (
                    <>
                      <Form.Group className="mb-3">
                        <Form.Control
                          type="text"
                          name="name"
                          placeholder="Enter your name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className={getFieldClassName('name')}
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className={getFieldClassName('email')}
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Control
                          type="date"
                          name="dob"
                          value={formData.dob}
                          onChange={handleChange}
                          required
                          className={getFieldClassName('dob')}
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
                          Enter the OTP sent to {formData.email}
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
                  <GoogleLoginButton mode="signup" onError={setError} />
                </div>

                <div className="text-center mt-3">
                  <span className="text-muted">Already have an account? </span>
                  <Link to="/login" className="auth-link">Sign in</Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;