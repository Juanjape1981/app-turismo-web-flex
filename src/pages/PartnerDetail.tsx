import { Button, Card, CardContent, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store/store';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { useEffect } from 'react';
import { fetchPartnerById } from '../redux/actions/partnerActions';
import User from '../models/User';
import '../styles/pages/PartnerDetail.scss';
import CardPartner from '../components/CardPartner/CardPartner';
import { fetchCategories, fetchCountries } from '../redux/actions/globalDataActions';

const PartnerDetail = () => {
    const dispatch = useAppDispatch();
    const partner = useAppSelector((state: RootState) => state.partner.partnerData);
    const user = useAppSelector((state: RootState) => state.user.userData) as User;
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(user).length) {
            dispatch(fetchPartnerById(user?.user_id));
        }
        dispatch(fetchCountries())
        dispatch(fetchCategories())
    }, [dispatch, user]);

    const handleCreateBranch = () => {
        navigate(`/new-branch`);
        
        // Navegar a la página de creación de sucursales o abrir un modal
    };

    const handleEditBranch = (branchId: number) => {
        // Navegar a la página de edición de sucursales o abrir un modal con el ID de la sucursal
        console.log(branchId);
    };

    const handleDeleteBranch = (branchId: number) => {
        console.log(branchId);
        // Lógica para eliminar la sucursal
    };

    const handleCardClick = (branchId: number) => {
        navigate(`/branch-promotions/${branchId}`);
    };

    
    return (
        <div className="partner-detail">
            <Typography variant="h4">Perfil del Asociado</Typography>
            <div className="partner-info">
                {partner && partner.categories && 
                <CardPartner partner={partner}/>
                }
            </div>
            <div className="branch-section">
                <div className="section-header">
                    <Typography variant="h5">Sucursales</Typography>
                </div>
                    
                <div className="branch-list">
                <div className='btn_newBranch'>
                        <Button variant="contained" color="primary" onClick={handleCreateBranch}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="2em" height="2em" viewBox="0 0 48 48"><g fill="currentColor"><path d="M22.5 28a1.5 1.5 0 1 1 0-3a1.5 1.5 0 0 1 0 3"/><path fillRule="evenodd" d="M9.429 20q.292 0 .571-.048V28H7.5a.5.5 0 0 0-.5.5v1a.5.5 0 0 0 .5.5h33a.5.5 0 0 0 .5-.5v-1a.5.5 0 0 0-.5-.5H38v-8.048q.28.048.571.048C40.473 20 42 18.448 42 16.551v-2.39a2.7 2.7 0 0 0-.163-.93l-2.18-6.01A1.85 1.85 0 0 0 37.917 6H10.082a1.85 1.85 0 0 0-1.738 1.222l-2.18 6.009a2.7 2.7 0 0 0-.164.93v2.39C6 18.448 7.527 20 9.429 20m-1.385-6.087L10.189 8H37.81l2.145 5.913q.044.12.044.248v2.39A1.44 1.44 0 0 1 38.57 18c-.78 0-1.428-.64-1.428-1.449a1 1 0 0 0-2 0A1.44 1.44 0 0 1 33.713 18c-.78 0-1.428-.64-1.428-1.448a1 1 0 0 0-2 0c0 .808-.648 1.448-1.429 1.448s-1.428-.64-1.428-1.449a1 1 0 1 0-2 0A1.44 1.44 0 0 1 24 18a1.44 1.44 0 0 1-1.429-1.448a1 1 0 0 0-2 0c0 .808-.647 1.448-1.428 1.448s-1.429-.64-1.429-1.449a1 1 0 1 0-2 0c0 .808-.647 1.449-1.428 1.449s-1.429-.64-1.429-1.449a1 1 0 1 0-2 0c0 .808-.647 1.449-1.428 1.449C8.647 18 8 17.36 8 16.551v-2.39q0-.129.044-.248M36 19.122a3.4 3.4 0 0 1-2.286.878a3.4 3.4 0 0 1-2.428-1.014A3.4 3.4 0 0 1 28.857 20a3.4 3.4 0 0 1-2.428-1.014A3.4 3.4 0 0 1 24 20a3.4 3.4 0 0 1-2.429-1.014A3.4 3.4 0 0 1 19.143 20c-.951 0-1.81-.389-2.429-1.014A3.4 3.4 0 0 1 14.286 20c-.88 0-1.68-.333-2.286-.878V28h2.5a.5.5 0 0 1-.5-.5v-2a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 .5.5v.5h1.5a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5H36zM8 33a1 1 0 0 1 1-1h30a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm2 7v-6h28v6z" clipRule="evenodd"/></g></svg>
                        Crear Sucursal
                    </Button>
                </div>
                    {partner?.branches.map((branch) => (
                        <Card key={branch.branch_id} onClick={() => handleCardClick(branch.branch_id)} className="branch-card">
                            <div className='btns_ed_del'>
                            <Button className='btnEdit' onClick={() => handleEditBranch(branch.branch_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 16 16"><path fill="currentColor" d="M16 4s0-1-1-2s-1.9-1-1.9-1L12 2.1V0H0v16h12V8zm-9.7 7.4l-.6-.6l.3-1.1l1.5 1.5zm.9-1.9l-.6-.6l5.2-5.2c.2.1.4.3.6.5zm6.9-7l-.9 1c-.2-.2-.4-.3-.6-.5l.9-.9c.1.1.3.2.6.4M11 15H1V1h10v2.1L5.1 9L4 13.1L8.1 12L11 9z" /></svg>
                            </Button>
                            <Button className='btnDelete' onClick={() => handleDeleteBranch(branch.branch_id)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.4em" height="1.4em" viewBox="0 0 26 26"><path fill="currentColor" d="M11.5-.031c-1.958 0-3.531 1.627-3.531 3.594V4H4c-.551 0-1 .449-1 1v1H2v2h2v15c0 1.645 1.355 3 3 3h12c1.645 0 3-1.355 3-3V8h2V6h-1V5c0-.551-.449-1-1-1h-3.969v-.438c0-1.966-1.573-3.593-3.531-3.593zm0 2.062h3c.804 0 1.469.656 1.469 1.531V4H10.03v-.438c0-.875.665-1.53 1.469-1.53zM6 8h5.125c.124.013.247.031.375.031h3c.128 0 .25-.018.375-.031H20v15c0 .563-.437 1-1 1H7c-.563 0-1-.437-1-1zm2 2v12h2V10zm4 0v12h2V10zm4 0v12h2V10z" /></svg>
                            </Button>    
                            </div>
                            
                            <CardContent>
                                <Typography variant="h6">{branch.name}</Typography>
                                <Typography variant="body2">{branch.description}</Typography>
                                <Typography variant="body2">Dirección: {branch.address}</Typography>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PartnerDetail;
