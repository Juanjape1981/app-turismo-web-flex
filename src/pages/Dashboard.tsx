import { Link } from 'react-router-dom';
// import { useAppSelector } from '../redux/store/hooks';
import '../styles/pages/Dashboard.scss';
// import MarketStall from "../assets/icons/MarketStallwhite.svg"
import Discount from "../assets/icons/Discount.svg"
import Analytics from "../assets/icons/Analytics.svg"
import profile from "../assets/icons/profile.svg"
// import faq from "../assets/icons/faq.svg"
import touristPoint from "../assets/icons/touristPoint.svg"
import users from "../assets/icons/users.svg"
import Messages from "../assets/icons/Messages.svg"
import fondo from '../assets/images/fondo-poli.svg'

const Dashboard = () => {
    // const user = useAppSelector((state) => state.user.userData);

    const routes = [
        { path: '/userProfile', label: 'Perfil de Usuario', icon: profile },
        { path: '/users-management', label: 'Gestión de Usuarios', icon: users },
        { path: '/promotions', label: 'Promociones', icon: Discount },
        { path: '/tourist-points', label: 'Puntos Turísticos', icon: touristPoint},
        { path: '/notifications', label: 'Notificaciones', icon: Messages },
        { path: '/reports', label: 'Reportes', icon: Analytics },
        // { path: '/partner', label: 'Sucursales', icon: '🏢' },
        // { path: '/new-branch', label: 'Crear Sucursal', icon: '➕' },
    ];

    return (
        <div className='dashboardContainer'>
            <img className='Background' src={fondo} alt="" />
            <h1 className='dashboardTitle'>Dashboard</h1>
            <div className='cardsContainer'>
                {routes.map((route, index) => (
                    <Link to={route.path} key={index} className='card'>
                        {/* <div className='cardIcon'>{route.icon}</div> */}
                        <img src={route.icon} alt="name-icon" className='cardIcon'/>
                        <h2 className='cardLabel'>{route.label}</h2>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default Dashboard;
