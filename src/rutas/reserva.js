const express = require("express");
const { asignarSeccion, validarReserva } = require("../middleware/reservas");

const crearRouterReservas = (controladorReservas) => {
  const router = express.Router();

  router.use(asignarSeccion);
  router.get("/", controladorReservas.listarReservas);
  router.get("/nueva", controladorReservas.formularioNuevaReserva);
  router.get("/:id/editar", controladorReservas.formularioEditarReserva);
  router.get("/:id/estado", controladorReservas.formularioEstadoReserva);
  router.get("/:id/eliminar", controladorReservas.formularioEliminarReserva);
  router.post("/:id/eliminar", controladorReservas.confirmarEliminacionReserva);
  router.get("/:id", controladorReservas.obtenerReservaPorId);
  router.post("/:id/editar", controladorReservas.guardarEdicionReserva);
  router.post("/:id/estado", controladorReservas.guardarEstadoReserva);
  router.post("/", validarReserva, controladorReservas.crearReserva);

  return router;
};

module.exports = { crearRouterReservas };
