import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/pages/Home.scss';
import { fetchRoles, fetchStatuses } from '../redux/actions/userActions';
import { fetchCountries } from '../redux/actions/globalDataActions';
import { useNavigate } from 'react-router-dom';
import video from '../assets/images/Loberia.mp4'
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'

const HomePage = () => {
  const { userData, accessToken } = useAppSelector((state: RootState) => state.user);
  console.log("componente home",userData, accessToken);

  const dispatch = useAppDispatch();
  console.log("usuario activo navbar");
  
  useEffect(() => {
    dispatch(fetchRoles());
    dispatch(fetchStatuses());
    dispatch(fetchCountries());
  }, [dispatch]);

  const navigate = useNavigate();

  const handleTouristRegistration = () => {
    navigate('/register');
  };

  return (
    <div className="home-container">
      <div className="content-container">
        <div className="registration-section">
          <h3>¡Bienvenido a Cobquecura!</h3>
          <p>
            Si eres turista, <strong>¡regístrate aquí!</strong> para comenzar a aprovechar nuestras promociones y
            disfrutar de todas las maravillas que nuestra comuna tiene para ofrecer.
          </p>
          <button className="button" onClick={handleTouristRegistration}>
            Registrarse como Turista
          </button>
        </div>
        <div className="video-section">
          <video autoPlay loop muted>
            <source src={video} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
      <section>
        <h2>Nuestra Misión</h2>
        <p>
          Somos la Cámara de Comercio, Turismo y Desarrollo de Cobquecura, dedicados a promover y fomentar un turismo
          familiar, seguro, sostenible y responsable en nuestra hermosa comuna. Preservamos y realzamos el paisaje
          natural y cultural de la región, promoviendo la conservación del medio ambiente y respetando las tradiciones
          locales, sin perturbar el estilo de vida campesino que caracteriza Cobquecura.
        </p>
      </section>
      <div className='divLogoHome'>
                    <img src={logo} className='LogoH' alt="LogoH" />
                    <img src={logo2} className='Logo2H' alt="Logo2H" />
            </div>

      {/* <section>
        <h2>Objetivos</h2>
        <ul>
          <li>Promover el turismo familiar y sostenible como motor de desarrollo económico en Cobquecura, sin perturbar el estilo de vida local.</li>
          <li>Garantizar la seguridad y bienestar de visitantes y residentes, manteniendo la tranquilidad y la identidad de la comuna.</li>
          <li>Conservar y preservar el medio ambiente a través de prácticas turísticas responsables que no interfieran con las tradiciones locales.</li>
          <li>Resaltar y poner en valor los recursos naturales y culturales de la comuna, incluyendo humedales, sitios geológicos, rompientes para surf, tradiciones campesinas, ferias y productos gastronómicos locales, de manera que beneficien a la comunidad sin alterar su estilo de vida.</li>
          <li>Fomentar el turismo inclusivo que sea accesible para todos, sin comprometer la calidad de vida local.</li>
          <li>Promover actividades deportivas que aprovechen las bellezas naturales de la región sin causar molestias.</li>
          <li>Contribuir al rescate y la promoción de la historia y patrimonio local, respetando las tradiciones campesinas.</li>
          <li>Trabajar en la actualización del Plan Regulador Comunal para proteger el paisaje y la calidad de vida, priorizando actividades sustentables como el turismo por encima de proyectos inmobiliarios masivos.</li>
        </ul>
      </section> */}
    </div>
  );
};

export default HomePage;
