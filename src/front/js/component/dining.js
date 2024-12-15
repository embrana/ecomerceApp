import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";

const Dining = () => {
  const { actions, store } = useContext(Context);
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarError, setMostrarError] = useState(false);
  const [alertaConcurrencia, setAlertaConcurrencia] = useState("baja");

  // Fetch reservas on component mount
  useEffect(() => {
    actions.fetchReservas();
  }, []);

  // Update concurrency alert
  useEffect(() => {
    if (mostrarAlerta) {
      const reservasEnHorario = store.reservas.filter(
        (reserva) => reserva.date === `${fecha}T${hora}:00`
      ).length;

      if (reservasEnHorario >= 30) {
        setAlertaConcurrencia("alta");
      } else if (reservasEnHorario >= 15) {
        setAlertaConcurrencia("media");
      } else {
        setAlertaConcurrencia("baja");
      }
    }
  }, [store.reservas, fecha, hora, mostrarAlerta]);

  const agregarReserva = (e) => {
    e.preventDefault();
    if (!fecha || !hora) {
      setMostrarError(true);
      return;
    }

    const nuevaReserva = { date: `${fecha}T${hora}:00` };
    actions.addReserva(nuevaReserva);
    setFecha("");
    setHora("");
    setMostrarAlerta(true);
    setMostrarError(false);
  };

  const eliminarReserva = (id) => {
    console.log("Deleting reserva with ID:", id);
    actions.deleteReserva(id);  // This will trigger the deletion logic in Flux
  };

  const renderizarAlerta = () => {
    const alertaColors = {
      alta: "#FF5833",
      media: "#FFAE42",
      baja: "#2ecc71",
    };

    const color = alertaColors[alertaConcurrencia] || "#2ecc71";

    return mostrarAlerta ? (
      <div
        style={{
          backgroundColor: color,
          padding: "10px",
          borderRadius: "5px",
          color: "white",
          textAlign: "center",
        }}
      >
        Concurrencia {alertaConcurrencia.toUpperCase()}
      </div>
    ) : null;
  };

  return (
    <div className="container mt-0">
      {/* Form Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-header text-center bg-primary text-white">
          <h4>Hacer Reserva</h4>
        </div>
        <div className="card-body">
          <form onSubmit={agregarReserva}>
            <div className="mb-3">
              <label className="form-label">Fecha:</label>
              <input
                type="date"
                className="form-control"
                value={fecha}
                onChange={(e) => setFecha(e.target.value)}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Hora:</label>
              <input
                type="time"
                className="form-control"
                value={hora}
                onChange={(e) => setHora(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Reservar
            </button>
            {mostrarError && (
              <p className="text-danger mt-2">Complete todos los campos</p>
            )}
          </form>
        </div>
      </div>

      {/* Concurrency Alert */}
      {renderizarAlerta()}

      {/* Reservations List */}
      <h2 className="text-center mt-4">Reservas</h2>
      <div className="card shadow-sm">
        <div className="card-body">
          <ul className="list-group">
            {store.reservas.length > 0 ? (
              store.reservas.map((reserva) => (
                <li key={reserva.id} className="list-group-item d-flex justify-content-between align-items-center">
                  {new Date(reserva.date).toLocaleString()}
                  <button
                    onClick={() => eliminarReserva(reserva.id)}
                    className="btn btn-danger btn-sm"
                  >
                    Eliminar
                  </button>
                </li>
              ))
            ) : (
              <li className="list-group-item">No hay reservas</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dining;
