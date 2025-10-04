import React, { useState, useEffect } from 'react'
import { loginStyles, toastStyle } from '../assets/dummystyles'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Mail, Lock, EyeOff } from 'lucide-react'

const Login = () => {

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();

  //TOAST VISIBILITY HANDLER
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => setToast({...toast, visible: false}), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(!formData.email.trim() || !formData.password.trim()) {
      setToast({visible:true, message: "All fields required", type: "error"})
      return;
    }
    setIsSubmitting(true)
    try{
      localStorage.setItem("authToken", 'demo-token')
      setToast({visible: true, message:"Login Successfull!", type:"success"})
      setTimeout(() => navigate('/'), 2000)
    }
    catch {
      setToast({visible: true, message:"Login failed!", type:"error"})
    }
    finally{
      setIsSubmitting(false)
    }
  }

    const handleSignOut = () => {
      localStorage.removeItem('authToken')
      setToast({visible: true, message:"Signed Out successful!", type:"success"})
    }

    const isLoggedIn = localStorage.getItem('authToken')

  return (
    <div className={loginStyles.container}>
      {toast.visible && (
        <div className={toastStyle(toast.type)}>{toast.message}</div>
      )}

      <div className={loginStyles.card}>
        <Link to='/' className={loginStyles.backLink}>
              <ArrowRight className=' rotate-180 mr-1 h-4 w-4' />
              Back to Home
        </Link>

        {!isLoggedIn ? (
          <>
          <div className='text-center mb-8'>
            <div className={loginStyles.iconCircle}>
              <Lock className=' h-6 w-6 text-[#43C6AC]' />
            </div>
            <h1 className={loginStyles.heading}>Sign In</h1>
            <p className={loginStyles.subheading}>Access your BookShell Account</p>
          </div>

          <form onSubmit={handleSubmit} className={loginStyles.form}>
          <div>
            <label className={loginStyles.label}>Email</label>
            <div className={loginStyles.inputWrapper}>
              <Mail className=' absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
              <input type='email' placeholder='mail@example.com'
              className={loginStyles.input} value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})} />
            </div>
          </div>

          <div>
            <label className={loginStyles.label}>Password</label>
            <div className={loginStyles.inputWrapper}>
              <Lock className=' absolute left-3 top-3.5 h-5 w-5 text-gray-400' />
              <input type={showPassword ? 'text' : 'password'} placeholder='**********'
              className={loginStyles.passwordInput} value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})} />

              <button type="button" onClick={() => setShowPassword(!showPassword)} 
              className={loginStyles.togglePassword}>
                {showPassword ? <EyeOff className=' h-5 w-5' /> : <EyeOff className=' h-5 w-5' />}
              </button>
            </div>
          </div>

          <button type='submit' disabled={isSubmitting} className={loginStyles.submitButton}>
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
          </form>

          <div className={loginStyles.footerText}>
              Don't have an account{" "}
              <Link to='/signup' className={loginStyles.footerLink}>Create Account</Link>
          </div>
          </>
        ) : ( 
          <div className={loginStyles.signedInContainer}>
            <div className={loginStyles.signedInIcon}>
              <Lock className=' h-6 w-6 text-[#43C6AC]' />
            </div>

            <h2 className={loginStyles.signedInHeading}>
              Welcome Back
            </h2>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login