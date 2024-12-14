import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
function Dining() {
  const { store, actions } = useContext(Context);
  const [reservas, setReservas] = useState(() => {
    const reservasGuardadas = localStorage.getItem("reservas");
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
  });
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [alertaConcurrencia, setAlertaConcurrencia] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [carrito, setCarrito] = useState([]);
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
  useEffect(() => {
    // Load existing reservations into Flux when the component mounts
    reservas.forEach((reserva) => {
      actions.addReserve(reserva);
    });
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
      mensaje = "Alta concurrencia";
    } else if (alertaConcurrencia === "media") {
      mensaje = "Media concurrencia";
    } else {
      mensaje = "Baja concurrencia";
    }
    return (
      <div style={estilosAlerta}>
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
  const eliminarReserva = (id) => {
    const nuevasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));
  };
  return (
    <div className="App">
      <form onSubmit={agregarReserva} className="d-flex flex-column flex-md-row my-4">
        <div className="d-flex flex-column flex-md-row w-100">
          <div className="d-flex align-items-center m-2">
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              className="form-control"
            />
          </div>
          <div className="d-flex align-items-center m-2">
            <select value={hora} onChange={(e) => setHora(e.target.value)} className="form-control">
              <option value="">Horario</option>
              {horariosDisponibles.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-lg m-2">
          Reservar
        </button>
      </form>
      {renderizarAlerta()}
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id}>
            Fecha: {reserva.fecha} Hora: {reserva.hora}
            <button onClick={() => eliminarReserva(reserva.id)} className="btn btn-danger">
              Eliminar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
export default Dining;