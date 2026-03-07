export const paymentMethods = {
  yape: {
    name: "Yape",
    number: "987 654 321",
    holder: "Rocket Store S.A.C.",
    instructions:
      "Abre tu app de Yape, escanea el QR o yapea al numero indicado con el monto exacto de tu pedido.",
    color: "#742284",
  },
  plin: {
    name: "Plin",
    number: "987 654 321",
    holder: "Rocket Store S.A.C.",
    instructions:
      "Abre tu app de Plin (Interbank, BBVA, Scotiabank), envia el pago al numero indicado.",
    color: "#00BCD4",
  },
  transferencia: {
    name: "Transferencia Bancaria",
    bank: "BCP",
    accountNumber: "191-0000000-0-00",
    cci: "00219100000000000000",
    holder: "Rocket Store S.A.C.",
    instructions:
      "Realiza la transferencia desde tu banca movil, banca por internet o en ventanilla al numero de cuenta indicado.",
    color: "#0033A0",
  },
};

export const peruDepartments = [
  "Amazonas",
  "Ancash",
  "Apurimac",
  "Arequipa",
  "Ayacucho",
  "Cajamarca",
  "Callao",
  "Cusco",
  "Huancavelica",
  "Huanuco",
  "Ica",
  "Junin",
  "La Libertad",
  "Lambayeque",
  "Lima",
  "Loreto",
  "Madre de Dios",
  "Moquegua",
  "Pasco",
  "Piura",
  "Puno",
  "San Martin",
  "Tacna",
  "Tumbes",
  "Ucayali",
];

export const orderStatuses = {
  pendiente: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  pago_verificado: { label: "Pago Verificado", color: "bg-blue-100 text-blue-800" },
  preparando: { label: "Preparando", color: "bg-orange-100 text-orange-800" },
  enviado: { label: "Enviado", color: "bg-purple-100 text-purple-800" },
  entregado: { label: "Entregado", color: "bg-green-100 text-green-800" },
  cancelado: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};
