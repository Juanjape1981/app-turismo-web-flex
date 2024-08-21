import '../styles/pages/_UnderConstruction.scss';
import imageConstruction from '../assets/images/en-construccion.png'

const UnderConstruction = () => {
    return (
        <div className="under-construction">
            <img src={imageConstruction} alt="En construcción" />
            {/* <h1>¡Estamos trabajando en ello!</h1> */}
            <p>Esta página estará disponible pronto. ¡Gracias por tu paciencia!</p>
        </div>
    );
};

export default UnderConstruction;
