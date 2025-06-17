import React, { useContext, useState } from "react";
import AuthLayout from "../../components/Layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import ProfilePhotoSelector from "../../components/Inputs/ProfilePhotoSelector";
import { API_PATHS } from "../../utils/apiPaths";
import uploadImage from "../../utils/uploadImage";
import { UserContext } from "../../context/UserContext";
import axiosInstance from "../../utils/axiosInstance";

const FloatingDecor = () => (
  <div className="absolute -top-8 -right-8 z-10 pointer-events-none">
    <div className="animate-spin-slow">
      <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
        <circle
          cx="30"
          cy="30"
          r="28"
          stroke="#a855f7"
          strokeWidth="3"
          opacity="0.18"
        />
        <circle
          cx="30"
          cy="30"
          r="18"
          stroke="#facc15"
          strokeWidth="2"
          opacity="0.12"
        />
      </svg>
    </div>
  </div>
);

const ProgressIndicator = () => (
  <div className="flex items-center gap-2 mb-4">
    <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
    <span className="w-2.5 h-2.5 rounded-full bg-purple-200"></span>
    <span className="text-xs text-purple-300 ml-2">Step 1 of 2</span>
  </div>
);

const SignUpForm = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  // Handle Sign Up Form Submit
  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Please enter your name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setError("Please enter the password");
      return;
    }

    setError("");
    setLoading(true);
    // SignUp API Call
    try {
      // Upload image if present
      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATHS.AUTH.REGISTER, {
        fullName,
        email,
        password,
        profileImageUrl,
      });

      const { token, user } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="relative flex justify-center items-center min-h-[80vh]">
        <div
          className="w-full max-w-md md:max-w-lg mx-auto animate-fade-in-up"
          style={{
            borderRadius: "32px",
            background: "rgba(30, 0, 60, 0.60)",
            boxShadow:
              "0 8px 32px 0 rgba(109,40,217,0.22), 0 0 60px 10px rgba(168,85,247,0.13), 0 2px 8px 0 #00000033",
            border: "2.5px solid rgba(168,85,247,0.18)",
            position: "relative",
            overflow: "hidden",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        >
          {/* Animated gradient border */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              borderRadius: "32px",
              padding: "2px",
              background:
                "conic-gradient(from 180deg at 50% 50%, #a855f7 0%, #6d28d9 50%, #a855f7 100%)",
              filter: "blur(2.5px)",
              opacity: 0.38,
              zIndex: 1,
            }}
          />
          <div className="relative z-10 px-6 py-8 sm:px-8 md:px-10 w-full">
            <FloatingDecor />
            <ProgressIndicator />
            <h3 className="text-2xl font-extrabold text-center bg-gradient-to-r from-purple-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent drop-shadow-lg tracking-tight">
              Create an Account
            </h3>
            <p className="text-xs text-purple-200 mt-2 mb-7 text-center font-medium">
              Join us today by entering your details below.
            </p>
            <form onSubmit={handleSignUp} className="space-y-5">
              <ProfilePhotoSelector
                image={profilePic}
                setImage={setProfilePic}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  value={fullName}
                  onChange={({ target }) => setFullName(target.value)}
                  label="Full Name"
                  placeholder="John"
                  type="text"
                  autoComplete="name"
                  className="modern-input"
                />
                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="john@example.com"
                  type="email"
                  autoComplete="email"
                  className="modern-input"
                />
                <div className="col-span-2 relative">
                  <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min 8 Characters"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="modern-input"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-8 text-xs text-purple-400 font-semibold hover:text-indigo-300 transition"
                    onClick={() => setShowPassword((v) => !v)}
                    tabIndex={-1}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
              {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}
              <button
                type="submit"
                className="w-full mt-2 bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-500 hover:from-purple-800 hover:to-indigo-500 text-white font-bold py-2.5 px-4 rounded-2xl shadow-xl transition-all duration-200 transform hover:scale-[1.03] active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
                disabled={loading}
                style={{
                  boxShadow:
                    "0 2px 8px 0 #a855f7bb, 0 1.5px 6px 0 #6366f180, 0 0.5px 2px 0 #00000033",
                }}
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </button>
              <p className="text-[13px] text-purple-200 mt-3 text-center">
                Already have an account?{" "}
                <Link
                  className="font-medium text-purple-400 underline hover:text-indigo-300 transition"
                  to="/login"
                >
                  Login
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
      <style>
        {`
          @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(40px);}
            100% { opacity: 1; transform: translateY(0);}
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.8s cubic-bezier(.4,2,.3,1) both;
          }
          .animate-spin-slow {
            animation: spin 8s linear infinite;
          }
          .modern-input input, .modern-input textarea {
            background: rgba(30,0,60,0.22) !important;
            border: 1.5px solid rgba(168,85,247,0.18) !important;
            border-radius: 14px !important;
            color: #f3e8ff !important;
            box-shadow: 0 1.5px 6px 0 #a855f71a;
            transition: border 0.2s, box-shadow 0.2s;
          }
          .modern-input input:focus, .modern-input textarea:focus {
            border: 1.5px solid #6366f1 !important;
            box-shadow: 0 2px 8px 0 #6366f133;
            outline: none;
          }
          .modern-input label {
            color: #c4b5fd !important;
            font-weight: 600;
            letter-spacing: 0.01em;
          }
          @media (max-width: 640px) {
            .max-w-md, .md\\:max-w-lg {
              max-width: 98vw !important;
            }
            .px-4, .sm\\:px-6, .md\\:px-8, .lg\\:px-10 {
              padding-left: 1rem !important;
              padding-right: 1rem !important;
            }
          }
        `}
      </style>
    </AuthLayout>
  );
};

export default SignUpForm;
