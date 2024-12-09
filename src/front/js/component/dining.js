import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 

// Componente de Carrito de Reservas
const ReservationCart = ({ reservas }) => {
  return (
    <div>
      <h3>Reservation Cart</h3>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            {reserva.fecha} at {reserva.hora}
          </li>
        ))}
      </ul>
    </div>
  );
};

function Dining() {
  const [reservas, setReservas] = useState(() => {
    const reservasGuardadas = localStorage.getItem("reservas");
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
  });
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [alertaConcurrencia, setAlertaConcurrencia] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [carrito, setCarrito] = useState([]);
  
  const generarHorarios = () => {
    const horarios = [];
    let horaActual = 7 * 60;
    const horaFinal = 18 * 60;

    while (horaActual <= horaFinal) {
      const horas = Math.floor(horaActual / 60);
      const minutos = horaActual % 60;
      horarios.push(
        `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`
      );
      horaActual += 30;
    }

    return horarios;
  };

  const horariosDisponibles = generarHorarios();

  const agregarReserva = (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      alert("Please fill in all fields.");
      return;
    }

    const nuevaReserva = { id: Date.now(), fecha, hora };
    const nuevasReservas = [...reservas, nuevaReserva];
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
    setMostrarAlerta(true);
    setFecha("");
    setHora("");
  };

  useEffect(() => {
    if (mostrarAlerta) {
      const reservasEnHorario = reservas.filter(
        (reserva) => reserva.fecha === fecha && reserva.hora === hora
      ).length;

      if (reservasEnHorario >= 30) {
        setAlertaConcurrencia("alta");
      } else if (reservasEnHorario >= 15) {
        setAlertaConcurrencia("media");
      } else {
        setAlertaConcurrencia("baja");
      }
    }
  }, [reservas, fecha, hora, mostrarAlerta]);

  const renderizarAlerta = () => {
    if (!mostrarAlerta) return null;

    const estilosAlerta = {
      padding: "1rem",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      backgroundColor:
        alertaConcurrencia === "alta"
          ? "#dc3545"
          : alertaConcurrencia === "media"
          ? "#ffc107"
          : "#0d6efd",
      color: "white",
      margin: "1rem 0",
    };

    const icono = (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="bi bi-exclamation-triangle-fill me-2"
        style={{ marginRight: "10px" }}
        width="24"
        height="24"
        fill="currentColor"
        viewBox="0 0 16 16"
      >
        <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
      </svg>
    );

    let mensaje = "";
    if (alertaConcurrencia === "alta") {
      mensaje = "High concurrency at this moment";
    } else if (alertaConcurrencia === "media") {
      mensaje = "Medium concurrency at this moment";
    } else {
      mensaje = "Low concurrency at this moment";
    }

    return (
      <div style={estilosAlerta}>
        {icono}
        <div>{mensaje}</div>
      </div>
    );
  };

  const cancelarReservas = () => {
    setReservas([]);
    localStorage.removeItem("reservas");
    setFecha("");
    setHora("");
  };

  const agregarAlCarrito = () => {
    if (fecha && hora) {
      setCarrito([...carrito, { fecha, hora }]);
      setFecha("");
      setHora("");
    }
  };

  const eliminarReserva = (id) => {
    const nuevasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
  };

  return (
    <div className="App">
      <form className="d-flex justify-content-between my-4" style={{ width: "50%" }} onSubmit={agregarReserva}>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
        <select value={hora} onChange={(e) => setHora(e.target.value)}>
          <option value="">Select a time</option>
          {horariosDisponibles.map((horario) => (
            <option key={horario} value={horario}>
              {horario}
            </option>
          ))}
        </select>
        <button className="btn btn-primary btn-sm ms-2" type="submit">Add Reservation</button>
      </form>

      {renderizarAlerta()}

      <h2>Your Reservations</h2>
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            {reserva.fecha} at {reserva.hora}
            <button
              type="button"
              className="btn text-end"
              onClick={() => eliminarReserva(reserva.id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>

      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button className="btn btn-primary me-md-2" onClick={cancelarReservas}>Cancel</button>
        <button className="btn btn-primary me-md-2" onClick={agregarAlCarrito}>Reserve</button>
      </div>

      {carrito.length > 0 && <ReservationCart reservas={carrito} />}
    </div>
  );
}

export default Dining;
