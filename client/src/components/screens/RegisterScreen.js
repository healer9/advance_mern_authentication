import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const RegisterScreen = ({ history }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (localStorage.getItem("authToken")) {
            history.push("/");
        }
    }, [history])

    const registerHandle = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            }
        }

        if (password !== confirmPassword) {
            setPassword('');
            setConfirmPassword('');
            setTimeout(() => {
                setError('');
            }, 5000);

            return setError("Passwords do not match");
        }

        try {
            const { data } = await axios.post("/api/auth/register", {
                username, email, password
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
            <form onSubmit={registerHandle}>
                <h3>Register</h3>
                {error && <span>{error}</span>}
                <div>
                    <label htmlFor="name">Username : </label>
                    <input
                        type="text"
                        required
                        id="name"
                        placeholder="Enter username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)} />
                </div>

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

                <div>
                    <label htmlFor="confirmpassword">Confirm Password : </label>
                    <input
                        type="password"
                        required
                        id="confirmpassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button type="submit">
                    <h2>Register</h2>
                </button>

                <span>Already Registered ?
                    <Link to="/login">Login</Link>
                </span>
            </form>
        </div>
    )
}

export default RegisterScreen
