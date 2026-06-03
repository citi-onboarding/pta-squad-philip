export function determinarStatusPorData(
  dataPrevistaDevolucao: Date | string
): "Em andamento" | "Atrasado" {
  const dataHoje = new Date();
  dataHoje.setHours(0, 0, 0, 0);

  const dataDevolucao = new Date(dataPrevistaDevolucao);
  dataDevolucao.setHours(0, 0, 0, 0);

  if (dataHoje > dataDevolucao) {
    return "Atrasado";
  }
  return "Em andamento";
}

export function obterCoresStatusEmail(status: "Em andamento" | "Atrasado") {
  if (status === "Atrasado") {
    return {
      statusCor: "#dc2626",
      statusFundo: "#fee2e2", 
    };
  }
  return {
    statusCor: "#b77900", 
    statusFundo: "#fff4bd",
  };
}