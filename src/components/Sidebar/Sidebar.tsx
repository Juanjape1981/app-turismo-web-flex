import React, { useEffect, useState } from 'react';
import '../../styles/components/_sidebar.scss';
import { Link } from 'react-router-dom';
import MarketStall from "../../assets/icons/MarketStall.svg"
import panel from "../../assets/icons/Dashboard.svg"
import Discount from "../../assets/icons/Discount.svg"
import Analytics from "../../assets/icons/Analytics.svg"
import profile from "../../assets/icons/profile.svg"
import faq from "../../assets/icons/faq.svg"
import touristPoint from "../../assets/icons/touristPoint.svg"
import users from "../../assets/icons/users.svg"
import Messages from "../../assets/icons/Messages.svg"
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import Route from '../../models/RouteModel';
import { logOutUser } from '../../redux/actions/userActions';
import { UserState } from '../../redux/reducers/userReducer';
import logoutIcon from "../../assets/icons/logout.svg";


const Sidebar: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // const isSidebarOpen = true
  const userActive: UserState = useAppSelector((state: any) => state.user);
  // if (userActive) 
  //   { console.log(userActive.accessToken); 

  //   }
  const [routes, setRoutes] = useState<Route[]>([]);
  const dispatch = useAppDispatch()

  //     useEffect(() => {
  //         const token = Cookies.get("data");
  //         if (token && !userActive.accessToken) {
  //             dispatch(userLogIn(null, token));
  //         }
  //     }, [dispatch]);


  useEffect(() => {
    if (userActive && userActive.accessToken) {
      setRoutes([
        {
          path: "/dashboard",
          name: "Panel General",
          style: "panelicono"
        },
        {
          path: "/socioPerfil",
          name: "Perfil de asociado",
          style: "asociados"
        },
        {
          path: "/promociones",
          name: "Promociones",
          style: "gestion"
        },
        {
          path: "/gestion-usuarios",
          name: "Usuarios",
          style: "usuarios"
        },
        {
          path: "/puntos_turisticos",
          name: "Puntos turísticos",
          style: "puntosturisticos"
        },
        {
          path: "/notificaciones",
          name: "Notificaciones",
          style: "notificaciones"
        },
        {
          path: "/userProfile",
          name: "Perfil",
          style: "userProfile"
        },
        {
          path: "/reportes",
          name: "Reportes",
          style: "reportes"
        },
        {
          path: "/",
          name: "Salir",
          style: "salir"
        },
        {
          path: "/faq",
          name: "FAQ",
          style: "faqicono"
        },
      ])
    } else {
      setRoutes([
        {
          path: "/faq",
          name: "FAQ",
          style: "faqicono"
        }
      ])
    }
  }, [userActive]);



  const handleMouseEnter = () => {
    setIsSidebarOpen(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarOpen(false);
  };
  // const handleNavigation = (path) => {
  //   // history.push(path);
  // };
  const logOut = () => {
    dispatch(logOutUser())

  }
  return (
    <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}>
      <div className='cont'>
        <ul className="sidebar-list">
          {routes.map((route: any, index: any) => (
            <li key={index}>
              <div className="sidebar-icon">
                {route.path !== "/" ?
                  <Link className="linkSidebar" to={route.path == "/" ? undefined : route.path}>
                    {route.style == "panelicono" ? <img src={panel} className='iconos' /> : null}
                    {route.style == "asociados" ? <img src={MarketStall} className='iconos' /> : null}
                    {route.style == "gestion" ? <img src={Discount} className='iconos' /> : null}
                    {route.style == "reportes" ? <img src={Analytics} className='iconos' /> : null}
                    {route.style == "usuarios" ? <img src={users} className='iconos' /> : null}
                    {route.style == "notificaciones" ? <img src={Messages} className='iconos' /> : null}
                    {route.style == "userProfile" ? <img src={profile} className='iconos' /> : null}
                    {route.style == "faqicono" ? <img src={faq} className='iconos' /> : null}
                    {route.style == "puntosturisticos" ? <img src={touristPoint} className='iconos' /> : null}
                    <span className={`sidebar-text ${isSidebarOpen ? 'open' : ''}`}>{route.name}</span>
                  </Link> : 
                  <div className='divSalir'> {route.style == "salir" ? <img src={logoutIcon} className='iconos' />: null}
                    <span onClick={logOut} className={`sidebar-text ${isSidebarOpen ? 'open' : ''}`}>{route.name}</span>
                  </div>
                }
              </div>
            </li>
          ))}
        </ul>

      </div>
      <div className={`politicas ${isSidebarOpen ? 'open' : ''}`}>

        <h3>Políticas y Términos</h3>
        <ul>
          <li><a className='pyc' href="/politica-de-privacidad">Política de Privacidad</a></li>
          <li><a className='pyc' href="/terminos-y-condiciones">Términos y Condiciones</a></li>
          <li><a className='pyc' href="/politica-de-cookies">Política de Cookies</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;