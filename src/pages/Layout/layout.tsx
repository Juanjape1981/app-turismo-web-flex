import Footer from '../../components/Footer/Footer';
import Navbar from '../../components/Navbar/Navbar';
import Sidebar from '../../components/Sidebar/Sidebar';
import '../../styles/layout/_layout.scss';

interface AppLayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: AppLayoutProps): JSX.Element => {
  return (
    <div className="Container_layout">
      <Navbar />
      <div className="layout">
                <Sidebar />
                <div className="childrenLayout">{children}</div>
            </div>
      <Footer />
    </div>
  );
}

export default Layout;