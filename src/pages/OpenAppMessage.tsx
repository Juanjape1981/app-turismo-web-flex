// import { Link } from 'react-router-dom';
import '../styles/pages/OpenAppMessage.scss';
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'

const OpenAppMessage = () => {
  return (
    <div className="open-app-message">
      <img src={logo} alt="Abre tu aplicación" className="app-image" />
      <img src={logo2} alt="Abre tu aplicación" className="app-image" />
      <h1>¡Contraseña Restablecida!</h1>
      <p>Tu contraseña ha sido restablecida con éxito.</p><p>Abre tu aplicación para continuar.</p> 
      {/* <Link to="/" className="back-home-button">Volver al inicio</Link> */}
    </div>
  );
};

export default OpenAppMessage;