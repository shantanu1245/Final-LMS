import React, { useState } from 'react';
import './login.css';
import logo from '../../Assets/logo.jpg';
import { auth, database } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { ref, set, get, push } from 'firebase/database';
import Swal from 'sweetalert2';



const Login = ({ setIsAuthenticated }) => {
  const [authMode, setAuthMode] = useState('login');
  const [userType, setUserType] = useState('admin');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    mobile: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);

  const renderUserTypeTabs = () => (
    <div className="user-type-tabs">
      <button className={`tab-button ${userType === 'admin' ? 'active' : ''}`} onClick={() => setUserType('admin')}>Admin</button>
      <button className={`tab-button ${userType === 'agent' ? 'active' : ''}`} onClick={() => setUserType('agent')}>Agent</button>
    </div>
  );

  const showWelcomeMessage = (userData) => {
    const { name, agentLimit, leadsLimit } = userData;
    const limitMessage = agentLimit && leadsLimit 
      ? `Your current limits: ${agentLimit} agents and ${leadsLimit} leads`
      : 'You have no specific limits set';
    
    Swal.fire({
      title: `Welcome, ${name}!`,
      text: `You're logged in as ${userType}. ${limitMessage}`,
      icon: 'success',
      confirmButtonText: 'Continue',
      confirmButtonColor: '#3085d6',
      backdrop: `
        rgba(0,0,123,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });
  };

  const handleLogin = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check user in Realtime Database
      const usersRef = ref(database, userType === 'admin' ? 'admins' : 'agents');
      const snapshot = await get(usersRef);
      
      let userFound = false;
      let userData = null;
      let userKey = null; // Add this line to store the user key
      
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const data = childSnapshot.val();
          if (data.email === email) {
            userFound = true;
            if (data.userType === userType) {
              userKey = childSnapshot.key; // Get the Firebase push key
              userData = {
                uid: user.uid,
                ...data
              };
              setIsAuthenticated(true);
              
              // Store user data in localStorage
              localStorage.setItem('userKey', userKey);
              localStorage.setItem('userType', userType);
              localStorage.setItem('userData', JSON.stringify(userData));
            } else {
              throw new Error(`You are registered as ${data.userType}, not ${userType}`);
            }
          }
        });
      }
      
      if (!userFound) {
        throw new Error(`${userType} not found in database. Please contact support.`);
      }
      
      // Show welcome message with limits
      if (userData) {
        showWelcomeMessage(userData);
      }
      
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleSignup = async () => {
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Prepare user data with default limits
      const userData = {
        uid: user.uid,
        name: formData.name,
        email: formData.email,
        mobile: formData.mobile,
        userType: userType,
        createdAt: new Date().toISOString(),
        active: true,
        agentLimit: userType === 'admin' ? 'Unlimited' : '10', // Default limits
        leadsLimit: userType === 'admin' ? 'Unlimited' : '50'  // Default limits
      };
      
      // Save to Realtime Database with push key
      const newUserRef = push(ref(database, userType === 'admin' ? 'admins' : 'agents'));
      await set(newUserRef, userData);
      
      // Show welcome message with default limits
      showWelcomeMessage(userData);
      
      // Automatically log in after signup
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      throw error;
    }
  };
  const renderLoginForm = () => (
    <>
      <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Login</h2>
      {renderUserTypeTabs()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group password-group">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={errors.password ? 'error' : ''} />
          <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="forgot-password">
          <button type="button" onClick={() => setAuthMode('forgot')} className="text-button">Forgot password?</button>
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Login'}</button>
      </form>

      <div className="auth-footer">
        <p>Don't have an account? <button type="button" onClick={() => setAuthMode('signup')} className="toggle-auth">Sign Up</button></p>
      </div>
    </>
  );

  const renderSignupForm = () => (
    <>
      <h2>{userType.charAt(0).toUpperCase() + userType.slice(1)} Sign Up</h2>
      {renderUserTypeTabs()}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" className={errors.name ? 'error' : ''} />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" className={errors.email ? 'error' : ''} />
          {errors.email && <span className="error-message">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Mobile Number" maxLength="10" className={errors.mobile ? 'error' : ''} />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className="form-group password-group">
          <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="Password" className={errors.password ? 'error' : ''} />
          <button type="button" className="toggle-password" onClick={() => setShowPassword(!showPassword)}>{showPassword ? '🙈' : '👁️'}</button>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm Password" className={errors.confirmPassword ? 'error' : ''} />
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Sign Up'}</button>
      </form>

      <div className="auth-footer">
        <p>Already have an account? <button type="button" onClick={() => setAuthMode('login')} className="toggle-auth">Login</button></p>
      </div>
    </>
  );

  const renderForgotPasswordForm = () => (
    <>
      <h2>Reset Password</h2>
      {resetEmailSent ? (
        <div className="reset-success">
          <p>We've sent a password reset link to <strong>{formData.email}</strong>.</p>
          <button type="button" className="auth-button" onClick={() => { setAuthMode('login'); setResetEmailSent(false); }}>Back to Login</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" className={errors.email ? 'error' : ''} />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <button type="submit" className="auth-button" disabled={isSubmitting}>{isSubmitting ? <span className="spinner"></span> : 'Send Reset Link'}</button>

          <div className="auth-footer">
            <p>Remember your password? <button type="button" onClick={() => setAuthMode('login')} className="toggle-auth">Login</button></p>
          </div>
        </form>
      )}
    </>
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (authMode === 'login' || authMode === 'signup') {
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    }

    if (authMode === 'signup') {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      if (!formData.mobile) {
        newErrors.mobile = 'Mobile number is required';
      } else if (!/^[0-9]{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };





  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setResetEmailSent(true);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      if (authMode === 'login') {
        await handleLogin(formData.email, formData.password);
      } else if (authMode === 'signup') {
        await handleSignup();
      } else if (authMode === 'forgot') {
        await handleForgotPassword();
      }
    } catch (error) {
      setErrors({ form: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <img src={logo} alt="Logo" className="auth-logo" />
        <div className="auth-card-inner">
          <div className="auth-card-front">
            {authMode === 'login' && renderLoginForm()}
            {authMode === 'signup' && renderSignupForm()}
            {authMode === 'forgot' && renderForgotPasswordForm()}
            {errors.form && <div className="error-message">{errors.form}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;