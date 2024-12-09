// import React from "react";

// const ReservationCart = ({ reservas }) => {
//   // Si no hay reservas, mostramos un mensaje informando que el carrito está vacío
//   if (reservas.length === 0) {
//     return <p>Your reservation cart is empty.</p>;
//   }

//   return (
//     <div className="reservation-cart">
//       <h3>Reservation Cart</h3>
//       <ul>
//         {reservas.map((reserva, index) => (
//           <li key={reserva.id}>
//             <div className="reservation-item">
//               <p><strong>Fecha:</strong> {reserva.fecha}</p>
//               <p><strong>Hora:</strong> {reserva.hora}</p>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Resumen de las reservas */}
//       <div className="reservation-summary">
//         <h4>Total Reservations: {reservas.length}</h4>
//       </div>

//       {/* Botones para confirmar la reserva o vaciar el carrito */}
//       <div className="reservation-buttons">
//         <button
//           onClick={() => alert("Proceeding to final confirmation...")}
//           className="btn btn-primary"
//         >
//           Confirm Reservation
//         </button>
//         <button
//           onClick={() => alert("Cancelling reservation...")}
//           className="btn btn-danger"
//         >
//           Cancel Reservation
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ReservationCart;
