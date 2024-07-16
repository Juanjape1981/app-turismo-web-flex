import { useEffect } from 'react';
import '../styles/components/_navBar.scss';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { UserState } from '../redux/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { logOutUser, userLogIn } from '../redux/actions/userActions';
import User from '../models/User';
import logo from '../assets/logo.png'
import logo2 from '../assets/logo2.png'

const Navbar: React.FC = () => {
    const userActive: UserState = useAppSelector((state: any) => state.user);
    const dispatch = useAppDispatch();

    useEffect(() => {
        const token = Cookies.get("data");
        if (token && !userActive.accessToken) {
            dispatch(userLogIn(null, token));
        }
    }, [dispatch, userActive.accessToken]);

    const isUser = (userData: any): userData is User => {
        return 'email' in userData; 
    }
    const logOut = () => {
      dispatch(logOutUser());
  };
    let routes = [];
    if (userActive.accessToken?.length) {
        routes = [
            {
                path: "/profile",
                name: userActive.userData && isUser(userActive.userData) ? userActive.userData.email : "User Email",
                style: "userName"
            },
        ];
    } else {
        routes = [
            {
                path: "/login",
                name: "LogIn",
                style: "route"
            },
            {
                path: "/register",
                name: "SignUp",
                style: "route"
            },
        ];
    }

    return (
        <nav className="navbar">
            <div className='divLogo'>
                <Link to="/">
                    <img src={logo} alt="Logo" />
                    <img src={logo2} alt="Logo2" />
                </Link>
            </div>
            <ul className="navbar-list">
                {routes.map((route, index) => (
                    <li key={index}>
                        <Link className={route.style} to={route.path}>
                            {route.name}
                        </Link>
                    </li>
                ))}
                {userActive.accessToken?.length && (
                    <li className='divUser'>
                      <div aria-label="logOut" data-balloon-pos="down" className='logOut' onClick={logOut}>
                            Cerrar Sesión
                        </div>
                        {userActive.userData && isUser(userActive.userData) && userActive.userData.image_url ?
                            <img src={userActive.userData.image_url} title='Edit' className='imageUser' alt="userImg" /> :
                            <img src="https://res.cloudinary.com/dbwmesg3e/image/upload/v1721157537/TurismoApp/no-product-image-400x400_1_ypw1vg_sw8ltj.png" title='Edit' className='imageUser' alt="userImg" />
                        }

                    </li>
                    
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
