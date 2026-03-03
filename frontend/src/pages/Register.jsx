import {useState} from "react";
import {useNavigate} from "react-router-dom";
import API from "../services/api";
import { Link } from "react-router-dom";


function Register(){
    const [name, setName]=useState("");
    const [email, setEmail]=useState("");
    const [password, setPassword]=useState("");
    const navigate=useNavigate();

    const handleRegister=async(e)=>{
        e.preventDefault();

        try{
            await API.post("/auth/register", {name, email, password});

            alert("Registration Successfull! Please Login");
            navigate("/");
        } catch (error){
            alert(error.response?.data?.message || "Registration failed");
        }
    }
    return (
        <div className="container">
            <h2>Register</h2>

            <form onSubmit={handleRegister}>
                <input type="text" placeholder="Full Name"
                onChange={(e) => setName(e.target.value)}
                required
                />

                <input type="text" placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
                required
                />

                <input type="text" placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                />

                <button type="submit">Register</button>
            </form>

            <p>
              Already have an account?{" "}
             <Link to="/">Login here</Link>
            </p>
        </div>
    )
}

export default Register;
