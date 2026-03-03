import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

function Login() {
      const [email, setEmail] = useState("");
      const [password, setPassword] = useState("");
      const navigate = useNavigate();

      const handleLogin=async(e)=>{ 
        e.preventDefault();
            try{
              const res=await API.post("/auth/login", {email, password});
              localStorage.setItem("token", res.data.token);
              navigate("/upload");
            } catch(err){
                alert("Login failed")
            }
      };

    return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <p>
      Don’t have an account?{" "}
      <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;