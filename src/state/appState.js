function initialScreen() {
  if (typeof location === "undefined") return "login";
  return location.hash.replace("#", "") || "login";
}

export const state = {
  screen: initialScreen(),
  logged: false,
  showLoginFields: false,
  trip: {
    date: "2025-05-24",
    destination: "Mendoza, Argentina",
    plate: "AB-CD-12",
    companions: 2,
    minors: true,
    pets: false,
    sag: true,
  },
  docs: [
    { id: "id", title: "Cedula o pasaporte", desc: "Documento de identidad del viajero", status: "Completado", type: "ok" },
    { id: "permit", title: "Permiso de circulacion", desc: "Vigente del pais de origen", status: "Pendiente", type: "pending" },
    { id: "insurance", title: "Seguro obligatorio", desc: "SOAPEX o equivalente", status: "Pendiente", type: "pending" },
    { id: "minor", title: "Autorizacion notarial para menores", desc: "Si viajas con menores de edad", status: "Opcional", type: "optional" },
    { id: "car", title: "Documento del vehiculo", desc: "Padron o titulo de propiedad", status: "Completado", type: "ok" },
  ],
  sagProducts: {
    "Frutas y verduras": true,
    "Semillas y plantas": false,
    "Carnes y embutidos": true,
    "Lacteos y derivados": false,
    Mascotas: false,
  },
  draftSaved: false,
  approved: false,
};
