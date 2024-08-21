
import '../../styles/components/_footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section1">
                    {/* <h3>Políticas y Términos</h3>
                <ul>
                    <li><a href="/politica-de-privacidad">Política de Privacidad</a></li>
                    <li><a href="/terminos-y-condiciones">Términos y Condiciones</a></li>
                    <li><a href="/politica-de-cookies">Política de Cookies</a></li>
                </ul> */}
                </div>
                <div className="footer-section2">
                    <h3>©2024 - Todos los derechos reservados
                    </h3>
                    <p>Cámara de Comercio, Turismo y Desarrollo de Cobquecura, A.G. (CCTD Cobquecura)</p>
                    <p>Teléfono:  / Correo electrónico: </p>

                </div>
                <div className="footer-section3">
                    <p></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;