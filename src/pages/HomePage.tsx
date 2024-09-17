import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/pages/Home.scss';

const HomePage = () => {
  const { userData, accessToken } = useAppSelector((state: RootState) => state.user);
  console.log("componente home",userData, accessToken);


  return (
    <div className="home">
      <div>Actualización versión 25/08/2024</div>;
      <p>This is the home page.</p>
    </div>
  );
};

export default HomePage;