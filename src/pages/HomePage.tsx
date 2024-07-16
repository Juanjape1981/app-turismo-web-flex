import { useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/pages/Home.scss';

const HomePage = () => {
  const { userData, accessToken } = useAppSelector((state: RootState) => state.user);
  console.log(userData, accessToken);


  return (
    <div className="home">
      <h1>Welcome to My App</h1>
      <p>This is the home page.</p>
    </div>
  );
};

export default HomePage;