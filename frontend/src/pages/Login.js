import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      const res = await axios.post("https://smarttasktracker-production.up.railway.app/login", {
        username,
        password,
      });
      localStorage.setItem("token", res.data.access_token);
      navigate("/dashboard");
    } catch (err) {
      alert("Login failed!");
    }
  };

  const goToRegister = () => {
    navigate("/register");
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <div style={{ marginTop: "10px" }}>
        <button onClick={login} style={{ marginRight: "10px" }}>
          Login
        </button>
        <button onClick={goToRegister}>
          Register
        </button>
      </div>
    </div>
  );
}
