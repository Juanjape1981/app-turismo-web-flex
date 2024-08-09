import { useState } from 'react';
import '../styles/pages/PasswordReset.scss';
import { resetPassword } from '../redux/actions/userActions';
import { useAppDispatch } from '../redux/store/hooks';
import logo3 from "../assets/logoCCTDC.png";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

// import { Link } from 'react-router-dom';

const PasswordReset= () => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const Toast = Swal.mixin({
        toast: true,
        position: "center",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        color: "#0F0C06",
        width: "50%",
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("enviar codigo");
        console.log(email,code,password);
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        } 
            dispatch(resetPassword({ email, code, password }))
            .then((response) => {
                console.log(response);
                setEmail('');
                setCode('');
                setPassword('');
                Toast.fire({
                    icon: "success",
                    title: `Tu contraseña fue restablecida correctamente`,
                  })
                  navigate('/open_app_instruction');
            })
            .catch((err) => {
                setError(err.message);
            });
    };

    return (
        <div className="password-reset-container">
            <div className="password-reset-containerFrom">

            <div className="logoDiv">
                {/* <Link className="logoCapitan" to="/"> */}
                  <img className="logo" src={logo3} alt="logo" />
                {/* </Link> */}
              </div>
            <h2>Reset Password</h2>

            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label htmlFor="code">Code:</label>
                <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                />
                <label htmlFor="password">New Password:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <label htmlFor="confirm_password">Confirm Password:</label>
                <input
                    type="password"
                    id="confirm_password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                />
                {error && <div className="error">{error}</div>}
                <button type="submit">Reset Password</button>
            </form>
            </div>
        </div>
    );
};

export default PasswordReset;
