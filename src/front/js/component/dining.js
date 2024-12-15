import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

function Dining() {
  const { store, actions } = useContext(Context);
  const [reservas, setReservas] = useState([]);  // Ensure reservas is always an array
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [alertaConcurrencia, setAlertaConcurrencia] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);

  // Function to generate available time slots
  const generarHorarios = () => {
    const horarios = [];
    let horaActual = 7 * 60; // 7:00 AM in minutes
    const horaFinal = 18 * 60; // 6:00 PM in minutes
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

  // Fetch user's reservations when the component mounts
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        const token = sessionStorage.getItem("auth_token");  // or sessionStorage, depending on where you store it
        
        if (!token) {
          throw new Error("No JWT token found");
        }
    
        const response = await fetch("https://miniature-space-fishstick-wpq9jqgx6gf59v6-3001.app.github.dev/api/reserve/", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
          }
        });
    
        if (!response.ok) {
          throw new Error("Failed to fetch reservas");
        }
    
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          setReservas(data.Reserve || []); // Ensure Reserve is always an array
          console.log(data); // Debugging output
        } else {
          throw new Error("Expected JSON response");
        }
      } catch (error) {
        console.error("Error fetching reservas:", error);
      }
    };

    fetchReservas();
  }, []); // Runs only once on component load

  const agregarReserva = (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      setMostrarError(true);
      return;
    }
    const nuevaReserva = { id: Date.now(), fecha, hora };
    const nuevasReservas = [...reservas, nuevaReserva];
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
    setMostrarAlerta(true);
    setMostrarError(false);
    // Add the new reservation to Flux
    actions.addReserve(nuevaReserva);
    setFecha("");
    setHora("");
  };

  const eliminarReserva = async (id) => {
    const reservasActualizadas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(reservasActualizadas);
    localStorage.setItem("reservas", JSON.stringify(reservasActualizadas));
    // Remove the reservation from Flux
    actions.removeReserve(id);
    
    // Delete from the backend as well
    try {
      const response = await fetch(`/api/reserve/${id}`, {
        method: "DELETE",
      });
      
      // If the response is not ok but the reservation was deleted, ignore the error
      if (!response.ok && response.status !== 404) {
        throw new Error("Failed to delete reservation");
      }
    } catch (error) {
      // Log the error but allow deletion to proceed
      console.error("Error deleting reservation:", error);
    }
  };

  useEffect(() => {
    if (mostrarAlerta) {
      const reservasEnHorario = (reservas || []).filter(
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
    if (!mostrarAlerta && !mostrarError) return null;

    const estilosAlerta = {
      padding: "1rem",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      backgroundColor:
        alertaConcurrencia === "alta"
          ? "#DC3545"
          : alertaConcurrencia === "media"
          ? "#FFC107"
          : alertaConcurrencia === "baja"
          ? "#0D6EFD"
          : "#FF5833",
      color: "white",
      margin: "1rem 0",
    };

    let mensaje = "";
    if (mostrarError) {
      mensaje = "Seleccione fecha y horario";
    } else if (alertaConcurrencia === "alta") {
      mensaje = "¡Alerta! Las reservas para este horario están casi completas.";
    } else if (alertaConcurrencia === "media") {
      mensaje = "Advertencia: Las reservas para este horario están medianamente llenas.";
    } else {
      mensaje = "Este horario está disponible.";
    }

    return (
      <div style={estilosAlerta}>
        <span>{mensaje}</span>
      </div>
    );
  };

  const formatearFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    return `${fecha.getUTCFullYear()}-${(fecha.getUTCMonth() + 1).toString().padStart(2, "0")}-${fecha
      .getUTCDate()
      .toString()
      .padStart(2, "0")} ${fecha.getUTCHours().toString().padStart(2, "0")}:${fecha
      .getUTCMinutes()
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="container">
      <h2>Reserva de Comida</h2>
      <form onSubmit={agregarReserva}>
        <div className="mb-3">
          <label htmlFor="fecha" className="form-label">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="hora" className="form-label">
            Hora
          </label>
          <select
            id="hora"
            className="form-select"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
          >
            <option value="">Seleccione una hora</option>
            {horariosDisponibles.map((horario, index) => (
              <option key={index} value={horario}>
                {horario}
              </option>
            ))}
          </select>
        </div>
        {renderizarAlerta()}
        {mostrarError && (
          <div className="alert alert-danger" role="alert">
            Debes seleccionar una fecha y una hora.
          </div>
        )}
        <button type="submit" className="btn btn-primary">
          Agregar Reserva
        </button>
      </form>
      {reservas.length > 0 && (
        <div className="mt-4">
          <h3>Reservas Realizadas</h3>
          <ul className="list-group">
            {reservas.map((reserva) => (
              <li key={reserva.id} className="list-group-item d-flex justify-content-between align-items-center">
                {formatearFecha(reserva.date)}
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => eliminarReserva(reserva.id)}
                >
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default Dining;
