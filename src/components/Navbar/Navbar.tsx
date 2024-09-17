import { useEffect } from 'react';
import '../../styles/components/_navBar.scss';
import { Link } from 'react-router-dom';
import Cookies from "js-cookie";
import { UserState } from '../../redux/reducers/userReducer';
import { useAppDispatch, useAppSelector } from '../../redux/store/hooks';
import { logOutUser, userLogIn } from '../../redux/actions/userActions';
import User from '../../models/User';
import logo from '../../assets/logo.png'
import logo2 from '../../assets/logo2.png'

const Navbar: React.FC = () => {
    const userActive: UserState = useAppSelector((state: any) => state.user);
    const dispatch = useAppDispatch();
    console.log("usuario activo navbar");
    
    useEffect(() => {
        const token = Cookies.get("data");
        console.log("token en navbar----",token);
        
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
                path: "/userProfile",
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

                        {route.name == "LogIn"&&
                        <Link className={route.style} to={route.path}>
                         <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 2048 2048"><path fill="currentColor" d="M1728 1152q26 0 45 19t19 45t-19 45t-45 19t-45-19t-19-45t19-45t45-19m-603-19q-79-54-170-81t-187-28q-88 0-170 23t-153 64t-129 100t-100 130t-65 153t-23 170H0q0-117 35-229t101-207t157-169t203-113q-56-36-100-83t-76-103t-47-118t-17-130q0-106 40-199t109-163T568 40T768 0t199 40t163 109t110 163t40 200q0 67-16 129t-48 119t-75 103t-101 83q81 29 156 80zM384 512q0 80 30 149t82 122t122 83t150 30q79 0 149-30t122-82t83-122t30-150q0-79-30-149t-82-122t-123-83t-149-30q-80 0-149 30t-122 82t-83 123t-30 149m1280 384q79 0 149 30t122 82t83 123t30 149q0 80-30 149t-82 122t-123 83t-149 30q-65 0-128-23v151h-128v128h-128v128H896v-282l395-396q-11-46-11-90q0-79 30-149t82-122t122-83t150-30m0 640q53 0 99-20t82-55t55-81t20-100q0-53-20-99t-55-82t-81-55t-100-20q-53 0-99 20t-82 55t-55 81t-20 100q0 35 9 64t21 61l-414 413v102h128v-128h128v-128h128v-91l93-92q40 23 77 39t86 16"/></svg>{route.name}</Link>}
                        { route.name == "SignUp"&&
                        <Link className={route.style} to={route.path}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.3em" height="1.3em" viewBox="0 0 36 36"><path fill="currentColor" d="M21 12H7a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1M8 10h12V7.94H8Z" className="clr-i-outline clr-i-outline-path-1"/><path fill="currentColor" d="M21 14.08H7a1 1 0 0 0-1 1V19a1 1 0 0 0 1 1h11.36L22 16.3v-1.22a1 1 0 0 0-1-1M20 18H8v-2h12Z" className="clr-i-outline clr-i-outline-path-2"/><path fill="currentColor" d="M11.06 31.51v-.06l.32-1.39H4V4h20v10.25l2-1.89V3a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v28a1 1 0 0 0 1 1h8a3.4 3.4 0 0 1 .06-.49" className="clr-i-outline clr-i-outline-path-3"/><path fill="currentColor" d="m22 19.17l-.78.79a1 1 0 0 0 .78-.79" className="clr-i-outline clr-i-outline-path-4"/><path fill="currentColor" d="M6 26.94a1 1 0 0 0 1 1h4.84l.3-1.3l.13-.55v-.05H8V24h6.34l2-2H7a1 1 0 0 0-1 1Z" className="clr-i-outline clr-i-outline-path-5"/><path fill="currentColor" d="m33.49 16.67l-3.37-3.37a1.61 1.61 0 0 0-2.28 0L14.13 27.09L13 31.9a1.61 1.61 0 0 0 1.26 1.9a1.6 1.6 0 0 0 .31 0a1.2 1.2 0 0 0 .37 0l4.85-1.07L33.49 19a1.6 1.6 0 0 0 0-2.27ZM18.77 30.91l-3.66.81l.89-3.63L26.28 17.7l2.82 2.82Zm11.46-11.52l-2.82-2.82L29 15l2.84 2.84Z" className="clr-i-outline clr-i-outline-path-6"/><path fill="none" d="M0 0h36v36H0z"/></svg>
                            {route.name}
                        </Link>
                        }
                    {userActive.accessToken?.length && 
                        <Link className={route.style} to={route.path}>
                            {route.name}
                        </Link>
                        }
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
