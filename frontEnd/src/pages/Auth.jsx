import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }
    localStorage.setItem("token", data.access_token);
    localStorage.setItem("username", data.username);
    navigate("/");
  };

  const handleRegister = async () => {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message);
      return;
    }
    localStorage.setItem("username", data.username);
    navigate("/");
  };

  return (
    <div className="bg-zinc-950 min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-6xl font-black text-white tracking-tight mb-2">
        Jam
      </h1>
      <p className="text-zinc-400 mb-12 text-lg">Listen music together</p>
      <div className="bg-zinc-900 p-8 rounded-2xl flex flex-col gap-4 w-96 border border-zinc-800">
        <div className="flex gap-2">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${isLogin ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-2 rounded-xl font-semibold transition-colors ${!isLogin ? "bg-violet-600 text-white" : "text-zinc-400 hover:text-white"}`}
          >
            Register
          </button>
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
        />
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
          />
        )}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-3 rounded-xl outline-none focus:ring-2 focus:ring-violet-500 placeholder-zinc-500"
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="bg-violet-600 hover:bg-violet-700 text-white font-semibold py-3 rounded-xl transition-colors"
        >
          {isLogin ? "Login" : "Register"}
        </button>
      </div>
    </div>
  );
}

export default Auth;
