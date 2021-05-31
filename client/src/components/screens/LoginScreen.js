import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const LoginScreen = ({ history }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history])

    const LoginHandle = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        try {
            const { data } = await axios.post("/api/auth/login", {
                email, password
            }, config);

            localStorage.setItem("authToken", data.token);
            history.push("/");
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError('');
            }, 5000);
        }
    }

    return (
        <div>
            <form onSubmit={LoginHandle}>
                <h3>Login</h3>
                {error && <span>{error}</span>}
                <div>
                    <label htmlFor="email">Email : </label>
                    <input
                        type="email"
                        required
                        id="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="password">Password : </label>
                    <input
                        type="password"
                        required
                        id="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <button type="submit">
                    <h2>Login</h2>
                </button>

                <span>Not Registered ?
                    <Link to="/register">Register</Link>
                </span>
            </form>
        </div>
    )
}

export default LoginScreen
