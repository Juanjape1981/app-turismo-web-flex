import React, { useState, useEffect } from 'react';
import { PromotionImage, PromotionUpdateModel } from '../models/PromotionModel';
import {  useAppSelector } from '../redux/store/hooks';
import '../styles/pages/_EditPromotionModal.scss';
import { compressAndConvertMultipleToBase64 } from '../utils/imageUtils';


interface EditPromotionModalProps {
    isOpen: boolean;
    promotion: PromotionUpdateModel | null;
    onClose: () => void;
    onSave: (editedPromotion: PromotionUpdateModel, deletedImageIds: any) => void;
}

const EditPromotionModal: React.FC<EditPromotionModalProps> = ({ isOpen, promotion, onClose, onSave }) => {
    
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startDate, setStartDate] = useState('');
    const [expirationDate, setExpirationDate] = useState('');
    const [discountPercentage, setDiscountPercentage] = useState(0);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [categoryIds, setCategoryIds] = useState<number[]>([]);
    const [status, setStatus] = useState<string>('');
    const [imagePaths, setImagePaths] = useState<PromotionImage[]>([]);
    const [compressedImages, setCompressedImages] = useState<string[]>([]);
    const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

    const statuses = useAppSelector(state => state.user.statuses); 
    const categories = useAppSelector(state => state.globalData.categories); 

    console.log("estados",statuses);
    console.log("categorias",categories);

    console.log("imagenes comprimidas",compressedImages);
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
            setImagePaths(promotion.images || []);
            setCompressedImages([]); 
            setDeletedImageIds([]); 
            setDeletedImageIds([]); 
        }
    }, [promotion]);


    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            try {
                const compressedBase64Images = await compressAndConvertMultipleToBase64(e.target.files);
                const previewImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));

                setCompressedImages(prevImages => [...prevImages, ...compressedBase64Images]);
                setImagePaths((prevPaths:any )=> [...prevPaths, ...previewImages]);
            } catch (error) {
                console.error("Error al comprimir o convertir imágenes:", error);
            }
        }
    };

    const handleRemoveImage = (imagePath: any, imageId?: number) => {
        if (imageId) {
            // Handle existing images
            setDeletedImageIds(prevDeleted => [...prevDeleted, imageId]);
            setImagePaths(prevPaths => prevPaths.filter((path:any) => path !== imagePath));
        } else {
            // Handle new images
            const index = imagePaths.indexOf(imagePath);
            setCompressedImages(prevImages => prevImages.filter((_, i) => i !== index));
            setImagePaths(prevPaths => prevPaths.filter((_, i) => i !== index));
        }
    };

    const handleSave = () => {
        if (promotion) {
            const editedPromotion: any = {
                title,
                description,
                start_date: startDate,
                expiration_date: expirationDate,
                discount_percentage: discountPercentage,
                available_quantity: availableQuantity,
                category_ids: categoryIds.map(id => Number(id)),
                // images: [...compressedImages],
                status: status === 'Activa' ? 1 : 2 
            };
            console.log("datos para actualizar la promoción",editedPromotion);

            onSave(editedPromotion, deletedImageIds);
            onClose(); // Cierra el modal
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
                    <label>
                        Fecha de Inicio:
                        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                    </label>
                    <label>
                        Fecha de Expiración:
                        <input type="date" value={expirationDate} onChange={(e) => setExpirationDate(e.target.value)} />
                    </label>
                    <label>
                        Descuento (%):
                        <input type="number" value={discountPercentage} onChange={(e) => setDiscountPercentage(Number(e.target.value))} />
                    </label>
                    <label>
                        Cantidad Disponible:
                        <input type="number" value={availableQuantity} onChange={(e) => setAvailableQuantity(Number(e.target.value))} />
                    </label>
                </div>

                {/* A la derecha */}
                <div className='Section_der'>
                <label>
                    Estado:
                    <select className='select_categ' value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="" disabled>Selecciona un estado</option>
                        <option value="Activa">Activa</option>
                        <option value="Inactiva">Inactiva</option>
                    </select>
                </label>    
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
                
                
                <label>
                    Subir Imágenes:
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} />
                </label>
                <div className="image-preview">
    {imagePaths.map((image, index) => (
        <div key={index} className="image-container">
            <img src={image.image_path} alt={`preview-${index}`} className="thumbnailImg" />
            <button 
                type="button" 
                onClick={() => handleRemoveImage(image.image_path, image.image_id)}
            >
                X
            </button>
        </div>
    ))}
</div>
                    
                <button onClick={handleSave}>Guardar</button>
                <button onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default EditPromotionModal;
