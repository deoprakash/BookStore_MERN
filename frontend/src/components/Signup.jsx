import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, User, ArrowLeft, EyeOff } from "lucide-react";
import { Signup as SignUpStyles } from "../assets/dummystyles"; 
import { Lock } from "lucide-react"; // adjust based on how you export

const SignUp = () => {
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: "", type: "" });
  const navigate = useNavigate();

  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast({ visible: false, message: "", type: "" });
        if (toast.type === "success") navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (!username.trim() || !email.trim() || !password.trim()) {
      setToast({ visible: true, message: "All fields are required", type: "error" });
      return;
    }
    setToast({ visible: true, message: "Creating Account...", type: "info" });
    setTimeout(() => {
      setToast({ visible: true, message: "Account Created!!", type: "success" });
    }, 2000);
  };

  return (
    <div className={SignUpStyles.container}>
      {toast.visible && (
        <div className={`${SignUpStyles.toastBase} ${toast.type === "success" ? SignUpStyles.toastSuccess : SignUpStyles.toastError}`}>
          {toast.message}
        </div>
      )}
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
  );
};

export default SignUp;
