import React, { useState, useEffect } from 'react';
import { PromotionUpdateModel } from '../models/PromotionModel';
import {  useAppSelector } from '../redux/store/hooks';
import '../styles/pages/_EditPromotionModal.scss';
import { compressAndConvertToBase64 } from '../utils/imageUtils';


interface EditPromotionModalProps {
    idPromo: any;
    isOpen: boolean;
    promotion: PromotionUpdateModel | null;
    onClose: () => void;
    onSave: (idPromo:any, editedPromotion: PromotionUpdateModel, deletedImageIds: any) => void;
}


const EditPromotionModal: React.FC<EditPromotionModalProps> = ({idPromo, isOpen, promotion, onClose, onSave }) => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [status, setStatus] = useState<any>(null);
    const [existingImages, setExistingImages] = useState<any[]>([]);
    const [newImages, setNewImages] = useState<any[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const statuses = useAppSelector(state => state.user.statuses); 
    const categories = useAppSelector(state => state.globalData.categories); 

    console.log("estados",statuses);
    console.log("categorias",categories);

    console.log("imagenes comprimidas",newImages);
    console.log("imagenes eliminadas",deletedImageIds);
    
    useEffect(() => {
        if (promotion) {
            setTitle(promotion.title);
            setDescription(promotion.description);
            setStartDate(promotion.start_date || '');
            setExpirationDate(promotion.expiration_date || '');
            setDiscountPercentage(promotion.discount_percentage || 0);
            setAvailableQuantity(promotion.available_quantity || 0);
            setCategoryIds(promotion.categories.map(cat => cat.category_id));
            setExistingImages(promotion.images || []);
            setNewImages([]);
            setDeletedImageIds([]);
            setStatus(promotion.status)
        }
    }, [promotion]);


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            try {
                for (const file of files) {
                    const base64Data = await compressAndConvertToBase64(file);
                    const imageObject = {
                        filename: file.name,
                        data: base64Data
                    };
                    setNewImages((prevImages) => [...prevImages, imageObject]);
                }
            } catch (error) {
                console.error('Error al procesar las imágenes:', error);
            }
        }
    };

    const handleRemoveImage = (imagePath: any, imageId?: number) => {
        if (imageId) {
            // Manejar imágenes existentes
            setDeletedImageIds(prevDeleted => [...prevDeleted, imageId]);
            setExistingImages(prevImages => prevImages.filter(img => img.image_id !== imageId));
        } else {
            // Manejar imágenes nuevas
            setNewImages(prevImages => prevImages.filter(img => img.data !== imagePath.data));
        }
    };

    const handleSave = () => {

        const processedImages = newImages.map((image:any) => ({
            filename: image.filename,
            data: image.data.split(',')[1]
        }));

        if (promotion) {
            const editedPromotion: any = {
                title,
                description,
                start_date: startDate,
                expiration_date: expirationDate,
                discount_percentage: discountPercentage,
                available_quantity: availableQuantity,
                category_ids: categoryIds.map(id => Number(id)),
                images: processedImages,
                status_id: status.name === 'activa' ? 1 : 2 
            };
            console.log("datos para actualizar la promoción",editedPromotion, "imagenes borradas",deletedImageIds);

            onSave(idPromo, editedPromotion, deletedImageIds);
            onClose();
        }
    };

    // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     if (e.target.files) {
    //         const files = Array.from(e.target.files);
    //         const images = files.map(file => URL.createObjectURL(file));
    //         setImagePaths(images);
    //     }
    // };

    const handleCategoryChange = (categoryId: number) => {
        setCategoryIds(prevIds =>
            prevIds.includes(categoryId)
                ? prevIds.filter(id => id !== categoryId) 
                : [...prevIds, categoryId] 
        );
    };


    const isFormValid = () => {
        return title && description && startDate && expirationDate && discountPercentage && availableQuantity && categories.length > 0;
    };
    console.log("formulario lleno",!isFormValid());
    return (
        <div className={`modal ${isOpen ? 'is-open' : ''}`}>
            <div className="modal-content">
                <h2>Editar Promoción</h2>
                <div className='cont_izq_der'>
                <div className='Section_izq'>
                
                    <label>
                        Título:
                        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} />
                    </label>
                    <label>
                        Descripción:
                        <textarea value={description}  onChange={(e) => setDescription(e.target.value)} />
                    </label>
                    <div className='fechas'>
                    <label>
                        Fecha de Inicio:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Fecha de Expiración:
                        <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                    </label>
                    </div>
                    <div className='fechas'>
                    <label>
                        Descuento (%):
                        <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} />
                    </label>
                    <label>
                        Cantidad Disponible:
                        <input type="number" value={availableQuantity} onChange={(e) => setAvailableQuantity(Number(e.target.value))} />
                    </label>

                    </div>
                <label className='estado'>
                    Estado:
                    <select className='select_categ' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="" disabled>Selecciona un estado</option>
                        <option value="activa">Activa</option>
                        <option value="inactiva">Inactiva</option>
                    </select>
                </label>    
                </div>

                {/* A la derecha */}
                <div className='Section_der'>
                <label>
                    Categorías:
                    <div>
                        {categories?.map(category => (
                            <div className='check_cat' key={category.category_id}>
                                <input
                                    type="checkbox"
                                    checked={categoryIds.includes(category.category_id)}
                                    onChange={() => handleCategoryChange(category.category_id)}
                                    className='checkbox'
                                />
                                <div className='cat_name'>{category.name}</div>
                            </div>
                        ))}
                    </div>
                </label>

                </div>
                </div>
                <div className='title_img'> 
                    <label className='titleCreate'>Subir imágenes</label>
                        </div>
                    <input id="file-input" className='inputImg' type="file" multiple accept="image/*" onChange={handleImageChange} />
                    {/* <input type="file" multiple accept="image/*" onChange={handleImageChange} /> */}
           
                <div className="image-preview">
                                    <label className='file-input' htmlFor="file-input">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="2.5em" height="2.5em" viewBox="0 0 24 24"><g fill="none" stroke="#317ABB" strokeLinecap="round" strokeWidth="1.5"><path strokeLinejoin="round" d="M21.25 13V8.5a5 5 0 0 0-5-5h-8.5a5 5 0 0 0-5 5v7a5 5 0 0 0 5 5h6.26"/><path strokeLinejoin="round" d="m3.01 17l2.74-3.2a2.2 2.2 0 0 1 2.77-.27a2.2 2.2 0 0 0 2.77-.27l2.33-2.33a4 4 0 0 1 5.16-.43l2.47 1.91M8.01 10.17a1.66 1.66 0 1 0-.02-3.32a1.66 1.66 0 0 0 .02 3.32"/><path strokeMiterlimit="10" d="M18.707 15v5"/><path strokeLinejoin="round" d="m21 17.105l-1.967-1.967a.458.458 0 0 0-.652 0l-1.967 1.967"/></g></svg>
                                   </label>
                    {/* Mostrar imágenes existentes */}
                    {existingImages.map((image, index) => (
                        <div key={index} className="image-container">
                            <img src={image.image_path} alt={`preview-${index}`} className="thumbnailImg" />
                            <button type="button" onClick={() => handleRemoveImage(image.image_path, image.image_id)} className="remove-imagebtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                            </button>
                        </div>
                    ))}

                    {/* Mostrar nuevas imágenes */}
                    {newImages.map((image, index) => (
                        <div key={index} className="image-container">
                            <img src={image.data} alt={`preview-${index}`} className="thumbnailImg" />
                            <button type="button" onClick={() => handleRemoveImage(image, undefined)} className="remove-imagebtn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                            </button>
                        </div>
                    ))}



    {/* {imagePaths.map((image:any, index:any) => (
        <div key={index} className="image-container">
            <img src={image.image_path} alt={`preview-${index}`} className="thumbnailImg" />
            <button type="button" onClick={() => handleRemoveImage(image.image_path, image.image_id)} className="remove-imagebtn">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                                    </button>
        </div>
    ))} */}
</div>
                    <div className='btsDiv'>

                <button className='subBtn' onClick={handleSave}>Guardar</button>
                <button className='clsBtn' onClick={onClose}>Cerrar</button>
                    </div>
            </div>
        </div>
    );
};

export default EditPromotionModal;
