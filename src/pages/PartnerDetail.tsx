import { Button, Card, CardContent, Typography, Grid, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../redux/store/store';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { useEffect } from 'react';
import { fetchPartnerById } from '../redux/actions/partnerActions';
import User from '../models/User';
import '../styles/pages/PartnerDetail.scss';

const PartnerDetail = () => {

    const dispatch = useAppDispatch();
    const partner = useAppSelector((state: RootState) => state.partner.partnerData);
    const user = useAppSelector((state: RootState) => state.user.userData) as User;
    const navigate = useNavigate();

    useEffect(() => {
        if (Object.keys(user).length) {
            dispatch(fetchPartnerById(user?.user_id));
        }
    }, [dispatch, user]);

    const handleCreateBranch = () => {
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
            <Typography variant="h4">Detalles del Asociado</Typography>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    {partner && partner.categories && 
                    <Card>
                        <CardContent>
                            <Avatar alt={partner.user.first_name} src={partner.user.image_url} />
                            <Typography variant="h6">{partner.user.first_name} {partner.user.last_name}</Typography>
                            <Typography variant="body1">Correo: {partner.user.email}</Typography>
                            <Typography variant="body1">Teléfono: {partner.user.phone_number}</Typography>
                            <Typography variant="body1">Tipo de Negocio: {partner.business_type}</Typography>
                            <Typography variant="body1">Dirección: {partner.address}</Typography>
                            <Typography variant="body1">Categorías: {partner.categories?.map(category => category.name).join(', ')}</Typography>
                        </CardContent>
                    </Card>
                    }
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleCreateBranch}>
                        Crear Nueva Sucursal
                    </Button>
                </Grid>
                <Grid item xs={12} style={{ marginTop: '20px' }}>
                    <Typography variant="h5">Sucursales</Typography>
                    <Grid container spacing={3}>
                        {partner?.branches.map((branch) => (
                            <Grid item xs={12} md={4} key={branch.branch_id}>
                                <Card onClick={() => handleCardClick(branch.branch_id)} className="branch-card">
                                    <CardContent>
                                        <Typography variant="h6">{branch.name}</Typography>
                                        <Typography variant="body2">{branch.description}</Typography>
                                        <Typography variant="body2">Dirección: {branch.address}</Typography>
                                    </CardContent>
                                    <Button variant="outlined" color="primary" onClick={() => handleEditBranch(branch.branch_id)}>
                                        Editar
                                    </Button>
                                    <Button variant="outlined" color="secondary" onClick={() => handleDeleteBranch(branch.branch_id)}>
                                        Eliminar
                                    </Button>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
};

export default PartnerDetail;
