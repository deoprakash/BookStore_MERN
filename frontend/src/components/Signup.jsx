import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ArrowLeft, EyeOff } from "lucide-react";
import { Signup as SignUpStyles } from "../assets/dummystyles"; 
import { Lock } from "lucide-react"; // adjust based on how you export
import SignupImage from '../assets/New York.jpg'

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({
          visible: false,
          message: "",
          type: "",
        });
      }, 3000);
  
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // HANDLE SUBMIT FUNCTION
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { username, email, password } = formData;
  
    // Validation
    if (!username.trim() || !email.trim() || !password.trim()) {
      setToast({
        visible: true,
        message: "All fields are required",
        type: "error",
      });
      return;
    }
  
    try {
      setToast({
        visible: true,
        message: "Creating Account...",
        type: "info",
      });
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'}/api/user/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });
  
      const data = await response.json();
  
      if (!response.ok) {
        setToast({
          visible: true,
          message: data.message || "Registration failed",
          type: "error",
        });
        return;
      }
  
      // Save token if backend returns one
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
  
      if (data.user) {
        localStorage.setItem("userName", data.user.username);
        localStorage.setItem("userEmail", data.user.email);
      }
  
      setToast({
        visible: true,
        message: "Account Created Successfully!",
        type: "success",
      });
  
      // Clear form
      setFormData({
        username: "",
        email: "",
        password: "",
      });
  
      // Redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 1500);
  
    } catch (error) {
      console.error("Signup Error:", error);
  
      setToast({
        visible: true,
        message: "Server Error",
        type: "error",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {toast.visible && (
        <div className={`${SignUpStyles.toastBase} ${toast.type === "success" ? SignUpStyles.toastSuccess : SignUpStyles.toastError}`} style={{ zIndex: 50 }}>
          {toast.message}
        </div>
      )}

      {/* LEFT IMAGE SECTION */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative overflow-hidden">
        <img src={SignupImage} alt="New York" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-[#43C6AC]/40" />
        <div className="relative z-10 flex flex-col justify-center px-16 text-white h-full w-full">
          <h1 className="text-5xl font-bold mb-6 tracking-tight">Join Our Community</h1>
          <p className="text-xl text-gray-200 leading-relaxed font-light">Become a part of the world's most dynamic sanctuary for book lovers. Start your literary journey today.</p>
        </div>
      </div>

      {/* RIGHT FORM SECTION */}
      <div className="w-full lg:w-1/2 flex items-center justify-center bg-gray-50 p-4 relative">
        <div className={SignUpStyles.card}>
          <Link to="/" className={SignUpStyles.backLink}>
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Home
          </Link>

          <div className="text-center mb-8">
            <div className={SignUpStyles.iconContainer}>
              <User className="h-6 w-6 text-[#43C6AC]" />
            </div>
            <h1 className={SignUpStyles.heading}>Create Account</h1>
            <p className={SignUpStyles.subtext}>Join our community of book lovers</p>
          </div>

          <form onSubmit={handleSubmit} className={SignUpStyles.form}>
            <div>
              <label className={SignUpStyles.label}>Username</label>
              <div className={SignUpStyles.inputWrapper}>
                <User className={SignUpStyles.iconLeft} />
                <input
                  type="text"
                  name="username"
                  placeholder="Enter Username"
                  className={SignUpStyles.input}
                  autoComplete="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={SignUpStyles.label}>Email</label>
              <div className={SignUpStyles.inputWrapper}>
                <Mail className={SignUpStyles.iconLeft} />
                <input
                  type="email"
                  name="email"
                  placeholder="email@example.com"
                  className={SignUpStyles.input}
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className={SignUpStyles.label}>Password</label>
              <div className={SignUpStyles.inputWrapper}>
                <Lock className={SignUpStyles.iconLeft} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="*********"
                  className={SignUpStyles.passwordInput}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className={SignUpStyles.togglePassword}>
                  {showPassword ? <EyeOff className=' h-5 w-5' /> : <EyeOff className=' h-5 w-5' />}
                </button>
              </div>
            </div>

            <button type="submit" className={SignUpStyles.submitBtn}>
              Create Account
            </button>
          </form>

          <div className={SignUpStyles.footerText}>
            Already have an account?{" "}
            <Link to="/login" className={SignUpStyles.link}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
