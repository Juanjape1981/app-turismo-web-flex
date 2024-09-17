import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../redux/store/store';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import User from '../models/User';
import { assignRoleToUser, fetchAllUsers, fetchRoles, fetchStatuses, updateUser } from '../redux/actions/userActions';
import { useAppDispatch } from '../redux/store/hooks';
import '../styles/pages/_userManagement.scss';
import RegisterPartnerModal from '../components/RegisterPartnerModal/RegisterPartnerModal';
import MarketStall from '../assets/icons/MarketStallwhite.svg';
import { fetchCategories } from '../redux/actions/globalDataActions';

const UserManagement = () => {
    const users = useSelector((state: RootState) => state.user.users);
    const roles = useSelector((state: RootState) => state.user.roles);
    const statuses = useSelector((state: RootState) => state.user.statuses);
    const dispatch = useAppDispatch();
    const MySwal = withReactContent(Swal);
    console.log("todos los users", users);
    // console.log("todos los roles", roles);
    // console.log("todos los estados", statuses);
    //Filtros
    const [nameFilter, setNameFilter] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [countryFilter, setCountryFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    // const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 10;


    
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);
    useEffect(() => {
        dispatch(fetchAllUsers());
        dispatch(fetchRoles());
        dispatch(fetchStatuses());
        dispatch(fetchCategories())
    }, [dispatch]);
    
    const handleUserClick = (user: User) => {
        MySwal.fire({
            title: `Editar Usuario`,
            html: `
            <input type="text" id="first_name" class="swal2-input" placeholder="Nombre" value="${user.first_name}">
            <input type="text" id="last_name" class="swal2-input" placeholder="Apellido" value="${user.last_name}">
            <input type="email" id="email" class="swal2-input" placeholder="Email" value="${user.email}">
            <input type="text" id="phone_number" class="swal2-input" placeholder="Teléfono" value="${user.phone_number}">
            <input type="text" id="city" class="swal2-input" placeholder="Ciudad" value="${user.city}">
            <input type="text" id="country" class="swal2-input" placeholder="País" value="${user.country}">
            <input type="date" id="birth_date" class="swal2-input" placeholder="Fecha de Nacimiento" value="${user.birth_date}">
                <select id="gender" class="swal2-inputDate">
                <option value="male" ${user.gender === 'male' ? 'selected' : ''}>Masculino</option>
                <option value="female" ${user.gender === 'female' ? 'selected' : ''}>Femenino</option>
                <option value="other" ${user.gender === 'other' ? 'selected' : ''}>Otro</option>
                <option value="prefer_not_to_say" ${user.gender === 'prefer_not_to_say' ? 'selected' : ''}>Prefiero no decirlo</option>
                </select>
                <select id="status" class="swal2-inputDate">
                ${statuses?.map(status => `
                    <option value="${status.id}" ${user.status.name === status.name ? 'selected' : ''}>${status.name}</option>
                    `).join('')}
                    </select>
                    <div class= "status-role">
                    <div class="role">
                    <strong>Roles:</strong>
                    ${roles?.map(role => `
                        <div class="status">
                        <input type="checkbox" id="role_${role.role_name}" value="${role.role_id}" ${user.roles.some(userRole => userRole.role_name === role.role_name) ? 'checked' : ''}>
                        <label for="role_${role.role_name}">${role.role_name}</label><br>
                        </div>
                        `).join('')}
                        
                        </div>
                        
                        `,
                        focusConfirm: false,
                        showCancelButton: true,
                        confirmButtonText: 'Guardar',
                        cancelButtonText: 'Cancelar',
                        preConfirm: () => {
                const first_name = (document.getElementById('first_name') as HTMLInputElement).value;
                const last_name = (document.getElementById('last_name') as HTMLInputElement).value;
                const email = (document.getElementById('email') as HTMLInputElement).value;
                const phone_number = (document.getElementById('phone_number') as HTMLInputElement).value;
                const birth_date = (document.getElementById('birth_date') as HTMLInputElement).value;
                const city = (document.getElementById('city') as HTMLInputElement).value;
                const country = (document.getElementById('country') as HTMLInputElement).value;
                const gender = (document.getElementById('gender') as HTMLSelectElement).value;
                const status_id = parseInt((document.getElementById('status') as HTMLSelectElement).value, 10);
                // const subscribed_to_newsletter = (document.getElementById('subscribed_to_newsletter') as HTMLInputElement)?.checked;
                
                // Capturar roles seleccionados
                const selectedRoles = Array.from(document.querySelectorAll('.status-role input:checked'))
                .map((checkbox: any) => checkbox.value);
                
                return {
                    first_name, last_name, email, phone_number, birth_date,
                    city, country, gender, status_id, roles: selectedRoles
                };
            },
        }).then(result => {
            if (result.isConfirmed) {
                const { first_name, last_name, email, phone_number, birth_date, city, country, gender, status_id, roles } = result.value;
                
                console.log( first_name, last_name, email, phone_number, birth_date, city, country, gender,"estados", status_id,"roles________________", roles );
                
                // Actualizar roles del usuario
                // Actualizar roles del usuario
          dispatch(assignRoleToUser({user_id:user.user_id, role_ids:roles}))
        
          .then((responseRol) => {
              console.log("respuesta de actualizacion de rol",responseRol);
                // Si la actualización de roles es exitosa, actualizar información del usuario
                return dispatch(updateUser({
                    user_id: user.user_id,
                    data: {
                        first_name,
                        last_name,
                        email,
                        phone_number,
                        birth_date,
                        city,
                        country,
                        gender,
                        status_id
                    }
                }));
            })
            .then(() => {
                // Mostrar mensaje de éxito si todo salió bien
                MySwal.fire('Éxito', 'Usuario actualizado correctamente', 'success');
                return dispatch(fetchAllUsers());
            })
            .catch((error) => {
                // Si ocurre un error en cualquiera de las operaciones, mostrar mensaje de error
                MySwal.fire('Error', error.message || 'No se pudo actualizar el usuario', 'error');
            });
            
        }
        });
    };
    const filteredUsers = users?.filter((user: User) => {
        return (
            (nameFilter === '' || user.first_name.toLowerCase().includes(nameFilter.toLowerCase()) || user.last_name.toLowerCase().includes(nameFilter.toLowerCase())) &&
            (emailFilter === '' || user.email.toLowerCase().includes(emailFilter.toLowerCase())) &&
            (roleFilter === '' || user.roles.some(role => role.role_name === roleFilter)) &&
            (statusFilter === '' || user.status.name === statusFilter) &&
            (countryFilter === '' || user.country.toLowerCase().includes(countryFilter.toLowerCase())) 
            // &&
            // (cityFilter === '' || user.city.toLowerCase().includes(cityFilter.toLowerCase()))
        );
    });
    const handleClearFilters = () => {
        setNameFilter('');
        setEmailFilter('');
        setRoleFilter('');
        setStatusFilter('');
        setCountryFilter('');
        setCityFilter('');
    };
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return (
        <div className="user-management">
           
            <div className='divbtnreg'>
            <button className='btnRegister' onClick={openModal}>
            <img src={MarketStall} className='iconos' />Registrar Asociado</button>    
            <h1>Gestión de Usuarios</h1>
            </div>
            
            
            {/* Filtros */}
            <div className="filters">
                <input 
                    className='inputFilter'
                    type="text"
                    placeholder="Filtrar por nombre"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                />
                <input 
                    className='inputFilter'
                    type="text"
                    placeholder="Filtrar por email"
                    value={emailFilter}
                    onChange={(e) => setEmailFilter(e.target.value)}
                />
                    <input
                        className='inputFilter'
                        type="text"
                        placeholder="Filtrar por país"
                        value={countryFilter}
                        onChange={(e) => setCountryFilter(e.target.value)}
                    />
                <select
                    className='inputFilter'
                    value={roleFilter}
                    onChange={(e) => setRoleFilter(e.target.value)}
                >
                    <option value="">Filtrar por rol</option>
                    {roles?.map((role) => (
                        <option key={role.role_id} value={role.role_name}>
                            {role.role_name}
                        </option>
                    ))}
                </select>
                <select
                    className='inputFilter'
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="">Filtrar por estado</option>
                    {statuses?.map((status) => (
                        <option key={status.id} value={status.name}>
                            {status.name}
                        </option>
                    ))}
                </select>
                {/* <input
                    className='inputFilter'
                    type="text"
                    placeholder="Filtrar por ciudad"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                /> */}
                <button className='btnFilter' onClick={handleClearFilters}>Limpiar Filtros</button>
            </div>
            {/* <div className='contBtn'><button className='btnFilter' onClick={handleClearFilters}>Limpiar Filtros</button> </div> */}
            
            <table className="user-table">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Apellido</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Estado</th>
                    </tr>
                </thead>
                <tbody>
                    {currentUsers.map((user: User) => (
                        <tr key={user.user_id} onClick={() => handleUserClick(user)}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td>{user.roles.map(role => role.role_name).join(', ')}</td>
                            <td>{user.status.name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="pagination">
                {[...Array(Math.ceil(filteredUsers.length / usersPerPage))].map((_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                    </button>
                ))}
            </div>
            {isModalOpen && <RegisterPartnerModal isOpen={isModalOpen} onClose={closeModal} />}
        </div>
    );
};

export default UserManagement;