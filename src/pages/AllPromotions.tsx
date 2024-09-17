import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { RootState } from '../redux/store/store';
import '../styles/pages/_AllPromotions.scss';
import { PromotionUpdateModel } from '../models/PromotionModel';
import EditPromotionModal from './EditPromotionModal';
import { useEffect, useState } from 'react';
import { createPromotion, deletePromotionById, fetchAllPromotions, updatePromotionById } from '../redux/actions/promotionActions';
import { formatDateTo_DD_MM_AAAA } from '../utils/dateUtils';
import { fetchStatuses } from '../redux/actions/userActions';
import { fetchCategories } from '../redux/actions/globalDataActions';
import CreatePromotionModal from '../components/createPromo/CreatePromotionModal';
import User from '../models/User';
import { fetchPartnerById } from '../redux/actions/partnerActions';


const AllPromotions = () => {
    const dispatch = useAppDispatch();
    const promotions = useAppSelector((state: RootState) => state.promotions.allPromotions.filter(promotion => promotion.status.name !== 'deleted'));
    const categories = useAppSelector((state: RootState) => state.globalData.categories);
    const partner = useAppSelector((state: RootState) => state.partner.partnerData);
    const [selectedPromotion, setSelectedPromotion] = useState<PromotionUpdateModel | null>(null);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isCreateModal, setIsCreateModal] = useState(false);
    const userData = useAppSelector((state: RootState) => state.user.userData) as User;
    const statuses = useAppSelector(state => state.user.statuses); 

    console.log("usuario en las promociones", userData);

    console.log("todas las promociones", promotions);
    console.log("promocion elegida", selectedPromotion);
    console.log("isCreateModal abierto?", isCreateModal, userData.user_id);

    // Estados para los filtros
    const [nameFilter, setNameFilter] = useState('');
    const [startDateFilter, setStartDateFilter] = useState('');
    const [endDateFilter, setEndDateFilter] = useState('');
    const [availableQuantityFilter, setAvailableQuantityFilter] = useState('');
    const [discountFilter, setDiscountFilter] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    

    useEffect(() => {
        dispatch(fetchAllPromotions());
        dispatch(fetchStatuses());
        dispatch(fetchCategories())
        if(userData){
        dispatch(fetchPartnerById(userData.user_id))    
        }
    }, [dispatch]);

    // Filtrar las promociones
    const filteredPromotions = promotions?.filter(promotion => {
        return (
            (nameFilter === '' || promotion.title.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (startDateFilter === '' || promotion.start_date >= startDateFilter) &&
            (endDateFilter === '' || promotion.expiration_date <= endDateFilter) &&
            (availableQuantityFilter === '' || promotion.available_quantity >= parseInt(availableQuantityFilter)) &&
            (discountFilter === '' || promotion.discount_percentage >= parseFloat(discountFilter))
        );
    });
    const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);
    const paginatedPromotions = filteredPromotions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleEdit = (promotion: PromotionUpdateModel) => {
        setSelectedPromotion(promotion);
        setModalOpen(true);
    };
    const handleCreate = () => {
        setIsCreateModal(true);
    };
    const handleDelete = (promotionId: number) => {
        // console.log(promotionId);
        // console.log("estado filtrado",statuses);
        const status = statuses?.filter(status => status.name == "deleted")
        console.log("estado filtrado",status);
        
        dispatch(deletePromotionById(promotionId, status))

    };

    const handleModalClose = () => {
        setModalOpen(false);
        setSelectedPromotion(null);
    };
    const handleCreateModalClose = () => {
        setIsCreateModal(false)
    };
    const handleSave = (idPromo:any, editedPromotion: any, deletedImageIds: any) => {
        console.log(editedPromotion, deletedImageIds);
        dispatch(updatePromotionById(idPromo, editedPromotion, deletedImageIds))
        
    };
    const handleCreateSave = (newPromotion: any) => {
        dispatch(createPromotion(newPromotion));
        // setCreateModalOpen(false);
    };
    const handleClearFilters = () => {
        setNameFilter('');
        setStartDateFilter('');
        setEndDateFilter('');
        setAvailableQuantityFilter('');
        setDiscountFilter('');
    };
    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
    };
    return (
        <div className="promotions-list">
            <div className='createPromotion'>
                <button onClick={handleCreate} className="createProm-btn">+ Crear Promoción</button>
                <h2>Promociones Disponibles</h2>
            </div>


            {/* Filtros */}
            <div className="filters">
                <input
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <div className='filtroFechas'>
                    <input
                        type="date"
                        value={startDateFilter}
                        onChange={(e) => setStartDateFilter(e.target.value)}
                    />
                    <label htmlFor="startDate">Promoción Inicia</label>
                </div>
                <div className='filtroFechas'>
                    <input
                        type="date"
                        placeholder="Fecha de finalización"
                        value={endDateFilter}
                        onChange={(e) => setEndDateFilter(e.target.value)}
                    />
                    <label htmlFor="startDate">Promoción Expira</label>
                </div>

                <input
                    type="number"
                    placeholder="Cantidad disponible"
                    value={availableQuantityFilter}
                    onChange={(e) => setAvailableQuantityFilter(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Descuento mínimo (%)"
                    value={discountFilter}
                    onChange={(e) => setDiscountFilter(e.target.value)}
                />
                <button className='clearBtn' onClick={handleClearFilters}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 1024 1024"><path fill="currentColor" d="m899.1 869.6l-53-305.6H864c14.4 0 26-11.6 26-26V346c0-14.4-11.6-26-26-26H618V138c0-14.4-11.6-26-26-26H432c-14.4 0-26 11.6-26 26v182H160c-14.4 0-26 11.6-26 26v192c0 14.4 11.6 26 26 26h17.9l-53 305.6c-.3 1.5-.4 3-.4 4.4c0 14.4 11.6 26 26 26h723c1.5 0 3-.1 4.4-.4c14.2-2.4 23.7-15.9 21.2-30M204 390h272V182h72v208h272v104H204zm468 440V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H416V674c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v156H202.8l45.1-260H776l45.1 260z" /></svg>Limpiar Filtros</button>
            </div>

            {filteredPromotions?.length === 0 ? (
                <p>No hay promociones disponibles.</p>
            ) : (
                <div className="table-container">
                <table className="promotions-table">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th className='align-center'>Fecha de Inicio</th>
                            <th className='align-center'>Fecha de Expiración</th>
                            <th className='align-center'>Cantidad Disponible</th>
                            <th className='align-center'>Cantidad Consumidas</th>
                            <th className='align-center'>Descuento (%)</th>
                            <th className='align-center'>Acciones</th>
                        </tr>
                    </thead>
                    {/* <tbody>
                        {filteredPromotions?.map((promotion: any) => (
                            <tr key={promotion.promotion_id}>
                                <td>{promotion.title}</td>
                                <td className='align-center'>{formatDateTo_DD_MM_AAAA(promotion.start_date)}</td>
                                <td className='align-center'>{formatDateTo_DD_MM_AAAA(promotion.expiration_date)}</td>
                                <td className='align-center'>{promotion.available_quantity? promotion.available_quantity : 'Sin límite'}</td>
                                <td className='align-center'>{promotion.consumed_quantity? promotion.consumed_quantity : 0}</td>
                                <td className='align-center'>{promotion.discount_percentage}</td>
                                <td>

                                    <button className="edit-btn2" onClick={() => handleEdit(promotion)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M16 4s0-1-1-2s-1.9-1-1.9-1L12 2.1V0H0v16h12V8zm-9.7 7.4l-.6-.6l.3-1.1l1.5 1.5zm.9-1.9l-.6-.6l5.2-5.2c.2.1.4.3.6.5zm6.9-7l-.9 1c-.2-.2-.4-.3-.6-.5l.9-.9c.1.1.3.2.6.4M11 15H1V1h10v2.1L5.1 9L4 13.1L8.1 12L11 9z" /></svg>
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(promotion.promotion_id)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg></button>
                                </td>
                            </tr>
                        ))}

                    </tbody> */}
                    <tbody>
                            {paginatedPromotions.map((promotion: any) => (
                                <tr key={promotion.promotion_id}>
                                    <td>{promotion.title}</td>
                                    <td className='align-center'>{formatDateTo_DD_MM_AAAA(promotion.start_date)}</td>
                                    <td className='align-center'>{formatDateTo_DD_MM_AAAA(promotion.expiration_date)}</td>
                                    <td className='align-center'>{promotion.available_quantity || 'Sin límite'}</td>
                                    <td className='align-center'>{promotion.consumed_quantity || 0}</td>
                                    <td className='align-center'>{promotion.discount_percentage}</td>
                                    <td>
                                    <button className="edit-btn2" onClick={() => handleEdit(promotion)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 16 16"><path fill="currentColor" d="M16 4s0-1-1-2s-1.9-1-1.9-1L12 2.1V0H0v16h12V8zm-9.7 7.4l-.6-.6l.3-1.1l1.5 1.5zm.9-1.9l-.6-.6l5.2-5.2c.2.1.4.3.6.5zm6.9-7l-.9 1c-.2-.2-.4-.3-.6-.5l.9-.9c.1.1.3.2.6.4M11 15H1V1h10v2.1L5.1 9L4 13.1L8.1 12L11 9z" /></svg>
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(promotion.promotion_id)}><svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                </table>
                </div>
            )}
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                    <button
                        key={index + 1}
                        className={currentPage === index + 1 ? 'active' : ''}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
            {selectedPromotion && (
                <EditPromotionModal
                idPromo={selectedPromotion.promotion_id}
                    isOpen={isModalOpen}
                    promotion={selectedPromotion}
                    onClose={handleModalClose}
                    onSave={handleSave}
                />
            )}
            {isCreateModal && userData.user_id &&
                <CreatePromotionModal
                
                isOpen={isCreateModal}
                onClose={handleCreateModalClose}
                onSave={handleCreateSave}
                categories={categories}
                partnerId={userData.user_id}
                partnerData={partner}
            />}
        </div>
    );
};

export default AllPromotions;
