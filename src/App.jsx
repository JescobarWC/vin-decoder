import { useState } from "react";

export default function VinDecoderDemo() {
  const [vin, setVin] = useState("");
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleCheckVin = async () => {
    if (!vin || vin.length < 10) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/vin?vin=${vin}`);
      const data = await res.json();
      if (data && data.success && data.specification) {
        setCarData(data.specification);
      } else {
        alert("No se pudieron obtener datos del VIN");
      }
    } catch (err) {
      alert("Error consultando el VIN");
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  const handleEnviarAWC = async () => {
    if (!carData) return;
    try {
      await navigator.clipboard.writeText(JSON.stringify(carData, null, 2));
      setSubmitted(true);
      alert("Datos copiados. Puedes pegarlos en la web de World Cars.");
    } catch (err) {
      alert("No se pudieron copiar los datos");
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="https://www.worldcars.es/images/logo.png" alt="World Cars" style={{ height: "70px" }} />
        <h1>Consulta Técnica por VIN</h1>
        <p>Herramienta interna de World Cars conectada con VINDecoder.eu (proxy)</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Introduce el VIN"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleCheckVin} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          {loading ? "Buscando..." : "Consultar"}
        </button>
      </div>

      {carData && (
        <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
          {Object.entries(carData).map(([key, value]) => (
            <p key={key}><strong>{key}:</strong> {String(value)}</p>
          ))}
          <textarea
            value={JSON.stringify(carData, null, 2)}
            readOnly
            style={{ width: "100%", marginTop: "1rem", height: "200px", fontFamily: "monospace" }}
          />
          <div style={{ textAlign: "right", marginTop: "1rem" }}>
            <button onClick={handleEnviarAWC} disabled={submitted} style={{ padding: "0.5rem 1rem" }}>
              {submitted ? "Enviado ✔" : "Enviar a web World Cars"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
