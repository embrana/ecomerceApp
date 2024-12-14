import React, { useState, useEffect, useContext } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";


// Componente para mostrar el carrito de reservas
const ReservationCart = ({ reservas }) => {
  return (
    <div>
      <h3>Reserva Comedor</h3>
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
  const { store, actions } = useContext(Context);
  const nuevaReserva = {
    id: "",
    fecha: "",
    hora: ""

  }
  // Estado para las reservas. Se recuperan del localStorage si existen.
  const [reservas, setReservas] = useState(() => {
    const reservasGuardadas = localStorage.getItem("reservas");
    return reservasGuardadas ? JSON.parse(reservasGuardadas) : [];
  });

  // Estado para la fecha y hora seleccionadas en el formulario
  const [fecha, setFecha] = useState("");
  const [hora, setHora] = useState("");

  // Estado para la alerta de concurrencia y los mensajes de error
  const [alertaConcurrencia, setAlertaConcurrencia] = useState("");
  const [mostrarAlerta, setMostrarAlerta] = useState(false);
  const [mostrarError, setMostrarError] = useState(false); // Estado para mostrar alerta de error
  const [carrito, setCarrito] = useState([]); // Carrito de reservas

  // Función para generar los horarios disponibles en intervalos de 30 minutos
  const generarHorarios = () => {
    const horarios = [];
    let horaActual = 7 * 60; // 7:00 AM en minutos
    const horaFinal = 18 * 60; // 6:00 PM en minutos

    while (horaActual <= horaFinal) {
      const horas = Math.floor(horaActual / 60);
      const minutos = horaActual % 60;
      // Añadir cada horario disponible en formato HH:mm
      horarios.push(
        `${horas.toString().padStart(2, "0")}:${minutos.toString().padStart(2, "0")}`
      );
      horaActual += 30; // Avanzar 30 minutos
    }

    return horarios;
  };

  const horariosDisponibles = generarHorarios(); // Lista de horarios generados

  // Función para agregar una nueva reserva
  const agregarReserva = (e) => {
    e.preventDefault();
    // Verificar que tanto la fecha como la hora estén seleccionadas
    if (!fecha || !hora) {
      setMostrarError(true); // Mostrar error si falta algún dato
      return;
    }

    // Crear una nueva reserva con un ID único (usando Date.now())
    nuevaReserva = { id: Date.now(), fecha, hora };
    const nuevasReservas = [...reservas, nuevaReserva];

    // Actualizar el estado de las reservas y guardarlas en el localStorage
    setReservas(nuevasReservas);
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas));

    // Mostrar la alerta y ocultar el error
    setMostrarAlerta(true);
    setMostrarError(false);

    // Limpiar los campos de fecha y hora
    setFecha("");
    setHora("");
  };

  // useEffect para verificar la concurrencia de reservas al agregar una nueva
  useEffect(() => {
    if (mostrarAlerta) {
      // Filtrar las reservas que coinciden con la fecha y hora seleccionadas
      const reservasEnHorario = reservas.filter(
        (reserva) => reserva.fecha === fecha && reserva.hora === hora
      ).length;

      // Determinar el nivel de concurrencia
      if (reservasEnHorario >= 30) {
        setAlertaConcurrencia("alta"); // Alta concurrencia
      } else if (reservasEnHorario >= 15) {
        setAlertaConcurrencia("media"); // Media concurrencia
      } else {
        setAlertaConcurrencia("baja"); // Baja concurrencia
      }
    }
  }, [reservas, fecha, hora, mostrarAlerta]); // Dependencias del useEffect

  // Función para renderizar la alerta dependiendo del nivel de concurrencia o error
  const renderizarAlerta = () => {
    if (!mostrarAlerta && !mostrarError) return null; // No mostrar alerta si no es necesario

    const estilosAlerta = {
      padding: "1rem",
      borderRadius: "5px",
      display: "flex",
      alignItems: "center",
      backgroundColor:
        alertaConcurrencia === "alta"
          ? "#dc3545" // Rojo para alta concurrencia
          : alertaConcurrencia === "media"
            ? "#ffc107" // Amarillo para media concurrencia
            : alertaConcurrencia === "baja"
              ? "#0d6efd" // Azul para baja concurrencia
              : "#ff5833", // Rojo para el error
      color: "white",
      margin: "1rem 0",
    };

    // Determinar el mensaje a mostrar
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

  // Función para cancelar todas las reservas
  const cancelarReservas = () => {
    setReservas([]); // Vaciar el estado de reservas
    localStorage.removeItem("reservas"); // Eliminar las reservas del localStorage
    setFecha(""); // Limpiar el campo de fecha
    setHora(""); // Limpiar el campo de hora
  };

  // Función para agregar una reserva al carrito
  const agregarAlCarrito = () => {
    if (fecha && hora) {
      setCarrito([...carrito, { fecha, hora }]); // Añadir la reserva al carrito
      setFecha(""); // Limpiar el campo de fecha
      setHora(""); // Limpiar el campo de hora
    }
  };

  // Función para eliminar una reserva
  const eliminarReserva = (id) => {
    const nuevasReservas = reservas.filter((reserva) => reserva.id !== id);
    setReservas(nuevasReservas); // Actualizar el estado de las reservas
    localStorage.setItem("reservas", JSON.stringify(nuevasReservas)); // Guardar en localStorage
  };

  const agregar = async (e) => {
    e.preventDefault()
    await actions.addReserve(nuevaReserva)//con action buscamos en flux//
  }
  return (
    <div className="App">
      {/* Formulario para agregar una nueva reserva */}
      <form
        className="d-flex justify-content-between my-4 flex-column flex-md-row"
        style={{ width: "100%" }}
        onSubmit={agregarReserva}
      >
        <div className="d-flex flex-column flex-md-row w-100">
          {/* Campo de fecha */}
          <div className="d-flex align-items-center m-2">
            <i className="fa-solid fa-calendar-day me-2"></i>
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              min={new Date().toISOString().split("T")[0]} // No permitir fechas anteriores a hoy
              className="form-control"
            />
          </div>

          {/* Campo de hora */}
          <div className="d-flex align-items-center m-2">
            <i className="fa-solid fa-clock me-2"></i>
            <select
              value={hora}
              onChange={(e) => setHora(e.target.value)}
              className="form-control"
            >
              <option value="">Horario</option>
              {horariosDisponibles.map((horario) => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botón para agregar la reserva */}
        <button
          className="btn btn-primary btn-lg ms-md-auto m-2 p-1 w-auto"
          type="button"
          style={{
            whiteSpace: "nowrap",  // Evita que el texto se divida en varias líneas
          }}
          onClick={(e) =>
            agregar(e)
          }
        >
          Reservar
        </button>
      </form>

      {renderizarAlerta()}

      {/* Lista de reservas actuales */}
      <ul>
        {reservas.map((reserva) => (
          <li key={reserva.id} className="d-flex justify-content-between align-items-center">
            <span>{reserva.fecha} at {reserva.hora}</span>
            <button
              type="button"
              className="btn text-danger"
              onClick={() => eliminarReserva(reserva.id)}
            >
              <i className="fa-solid fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>

      {/* Mostrar el carrito de reservas */}
      <h1>
        {carrito.length > 0 && <ReservationCart reservas={carrito} />}
      </h1>

      {/* Botones de cancelar y reservar */}
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
        <button
          className="btn btn-secondary me-md-2 w-100 w-md-auto h-100"
          onClick={cancelarReservas}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default Dining;
