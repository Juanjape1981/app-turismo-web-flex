// import React, { useEffect, useState } from 'react';
// import { Promotion } from '../models/PromotionModel';
// import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
// import { deletePromotionById, fetchBranchPromotions } from '../redux/actions/promotionActions';

// const BranchPromotions: React.FC<{ branchId: number }> = ({ branchId }) => {
//   const dispatch = useAppDispatch();
//   const promotions = useAppSelector<Promotion[]>(state => state.promotions.branchPromotions);
//   const [newPromotion, setNewPromotion] = useState<Promotion>({ promotion_id: 0, title: '', description: '', branchId });


//   useEffect(() => {
//     dispatch(fetchBranchPromotions(branchId));
//   }, [dispatch, branchId]);

//   const handleCreatePromotion = () => {
//     console.log("creando promo");
//     // dispatch(createPromotion(newPromotion));
//     // setNewPromotion({ id: 0, title: '', description: '', branchId });
//   };

//   const handleUpdatePromotion = (promotion: Promotion) => {
//     console.log("actualizando promo", promotion);
    
//     // dispatch(updatePromotionById(promotion));
//   };

//   const handleDeletePromotion = (promotionId: number) => {
//     dispatch(deletePromotionById(promotionId));
//   };

//   return (
//     <div>
//       <h2>Promociones de la Sucursal</h2>
//       <ul>
//         {promotions.map(promotion => (
//           <li key={promotion.id}>
//             <input
//               type="text"
//               value={promotion.title}
//               onChange={(e) => handleUpdatePromotion({ ...promotion, title: e.target.value })}
//             />
//             <textarea
//               value={promotion.description}
//               onChange={(e) => handleUpdatePromotion({ ...promotion, description: e.target.value })}
//             />
//             <button onClick={() => handleDeletePromotion(promotion.id)}>Eliminar</button>
//           </li>
//         ))}
//       </ul>

//       <div>
//         <h3>Crear Nueva Promoción</h3>
//         <input
//           type="text"
//           placeholder="Título"
//           value={newPromotion.title}
//           onChange={(e) => setNewPromotion({ ...newPromotion, title: e.target.value })}
//         />
//         <textarea
//           placeholder="Descripción"
//           value={newPromotion.description}
//           onChange={(e) => setNewPromotion({ ...newPromotion, description: e.target.value })}
//         />
//         <button onClick={handleCreatePromotion}>Crear</button>
//       </div>
//     </div>
//   );
// };

// export default BranchPromotions;
