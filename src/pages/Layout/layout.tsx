import Footer from '../../components/Footer';
import Navbar from '../../components/Navbar';
import '../../styles/layout/_layout.scss'; // Asegúrate de tener los estilos correctos

interface AppLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <div className="Container_layout">
      <Navbar />
      <div className="layout">
        <div className="childrenLayout">{children}</div>
      </div>
      <Footer />
    </div>
  );
}

export default Layout;