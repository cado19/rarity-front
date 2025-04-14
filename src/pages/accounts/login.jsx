import React, { useState } from "react";
import { baseURL } from "../../constants/url";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Logo from "../../assets/rarity_logo.png";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.0 } },
  };

  const navigate = useNavigate();

  const baseUrl = import.meta.env.VITE_BASE_URL;

  const loginUrl = baseUrl + "/api/accounts/login.php";
  // console.log(loginUrl);
  const validateEmail = (email) => {
    // Email validation logic here
    if (email === "") {
      const email_err = "Email is required";
      setEmailError(email_err);
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      const email_err = "Email is invalid";
      setEmailError(email_err);
    }
  };

  const validatePassword = (password) => {
    if (password === "") {
      const password_err = "Password is required";
      setPasswordError(password_err);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setPending(true);
    // Handle login logic here
    validateEmail(email);
    validatePassword(password);
    if (emailError || passwordError) {
      alert("Please check the form for errors");
      setPending(false);
    } else {
      // submit the form
      axios.post(loginUrl, { email, password }).then((response) => {
        console.log(response);
        if (response.data.message === "Logged in") {
          localStorage.setItem("loggedIn", true);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          navigate("/");
        } else {
          alert("Invalid email or password");
          setPending(false)
        }
      });
    }
    console.log("Email:", email);
    console.log("Password:", password);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md"
      >
        <img src={Logo} alt="Rarity Logo" className="w-24 mx-auto" />
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={pending}
            >
              Login
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
