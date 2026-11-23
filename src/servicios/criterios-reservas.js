const clavesPermitidas = ["q", "sala", "orden", "pagina", "limite"];
const ordenesPermitidos = ["estudiante", "personas-asc", "personas-desc"];

const leerCriterios = (consulta) => {
  const clavesDesconocidas = Object.keys(consulta).filter(
    (clave) => !clavesPermitidas.includes(clave),
  );

  if (clavesDesconocidas.length > 0) {
    throw new Error(
      `Hay parametros de busqueda desconocidos: ${clavesDesconocidas.join(", ")}`,
    );
  }

  const leerTexto = (clave) => {
    const valor = consulta[clave];
    if (
      Array.isArray(valor) ||
      (valor !== undefined && typeof valor !== "string")
    ) {
      throw new Error(`El parámetro ${clave} debe ser un texto único`);
    }

    return valor?.trim() ?? "";
  };

  const q = leerTexto("q");
  const sala = leerTexto("sala");
  const orden = leerTexto("orden");
  const paginaTexto = leerTexto("pagina");
  const limiteTexto = leerTexto("limite");

  let pagina = 1;

  if (consulta.pagina !== undefined) {
    if (paginaTexto === "" || !/^\d+$/.test(paginaTexto)) {
      throw new Error("El parámetro pagina no es válido");
    }

    pagina = Number(paginaTexto);

    if (!Number.isInteger(pagina) || pagina < 1 || pagina > 1000) {
      throw new Error("El parámetro pagina no es válido");
    }
  }
  let limite = 2;

  if (consulta.limite !== undefined) {
    if (limiteTexto === "" || !/^\d+$/.test(limiteTexto)) {
      throw new Error("El parámetro limite no es válido");
    }

    limite = Number(limiteTexto);

    if (!Number.isInteger(limite) || limite < 1 || limite > 20) {
      throw new Error("El parámetro limite no es válido");
    }
  }
  if (q.length > 60) {
    throw new Error("El parametro q no puede tener más de 60 caracteres");
  }
  if (sala.length > 80) {
    throw new Error("El parametro sala no puede tener más de 80 caracteres");
  }
  if (consulta.orden !== undefined && !ordenesPermitidos.includes(orden)) {
    throw new Error(`El parametro orden no es valido`);
  }

  const ordenFinal = consulta.orden === undefined ? "estudiante" : orden;

  return {
    q,
    sala,
    orden: ordenFinal,
    pagina,
    limite,
  };
};

module.exports = {
  leerCriterios,
};
