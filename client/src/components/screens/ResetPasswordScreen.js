import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ResetPasswordScreen = ({ match }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const resetPasswordHandler = async (e) => {
        e.preventDefault();

        const config = {
            headers: {
                "Content-Type": "application/json"
            },
        };

        if (password !== confirmPassword) {
            setPassword("");
            setConfirmPassword("");

            setTimeout(() => {
                setError("");
            }, 5000);

            return setError("Password don't match");
        }

        try {
            const { data } = await axios.put(
                `/api/auth/resetpassword/${match.params.resetToken}`,
                { password },
                config
            )

            //console.log(data);
            setSuccess(data.data);
        } catch (error) {
            setError(error.response.data.error);
            setTimeout(() => {
                setError("");
            }, 5000);
        }
    }

    return (
        <div>
            <form onSubmit={resetPasswordHandler}>
                <h3>Reset Password</h3>
                {error && <span>{error}</span>}

                {success && (
                    <span>
                        {success}
                        <Link to="/login"></Link>
                    </span>
                )}

                <div>
                    <label htmlFor="password">New Password : </label>
                    <input
                        type="password"
                        required
                        id="password"
                        placeholder="Enter new Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div>
                    <label htmlFor="confirmpassword">Confirm New Password : </label>
                    <input
                        type="password"
                        required
                        id="confirmpassword"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>

                <button type="submit">
                    Reset Password
                </button>

            </form>
        </div>
    )
}

export default ResetPasswordScreen
