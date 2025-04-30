import { useState } from "react";

export default function VinDecoderDemo() {
  const [vin, setVin] = useState("");
  const [carData, setCarData] = useState(null);
  const [oemData, setOemData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const sha1 = async (str) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, "0")).join("").substring(0, 10);
  };

  const apiKey = "bd5626317e2f";
  const secretKey = "59f8372fc4";

  const handleCheckVin = async () => {
    if (!vin || vin.length < 10) return;
    setLoading(true);
    const method = "decode";
    const controlString = `${vin}|${method}|${apiKey}|${secretKey}`;
    const controlSum = await sha1(controlString);
    const url = `https://api.vindecoder.eu/3.2/${apiKey}/${controlSum}/decode/${vin}.json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Ficha técnica:", data);
      if (data && data.decode) {
        setCarData(data.decode);
      } else {
        alert("No se pudieron obtener datos técnicos.");
      }
    } catch (err) {
      console.error("Error técnico:", err);
      alert("Error consultando la ficha técnica");
    } finally {
      setLoading(false);
      setSubmitted(false);
    }
  };

  const handleOEMLookup = async () => {
    if (!vin || vin.length < 10) return;
    setLoading(true);
    const method = "lookup";
    const controlString = `${vin}|${method}|${apiKey}|${secretKey}`;
    const controlSum = await sha1(controlString);
    const url = `https://api.vindecoder.eu/3.2/${apiKey}/${controlSum}/decode/lookup/${vin}.json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      console.log("Datos OEM:", data);
      if (data && data.lookup) {
        setOemData(data.lookup);
      } else {
        alert("No se encontraron datos OEM.");
      }
    } catch (err) {
      console.error("Error OEM:", err);
      alert("Error consultando el equipamiento OEM");
    } finally {
      setLoading(false);
    }
  };

  const handleEnviarAWC = async () => {
    const combined = { fichaTecnica: carData, equipamientoOEM: oemData };
    try {
      await navigator.clipboard.writeText(JSON.stringify(combined, null, 2));
      setSubmitted(true);
      alert("Datos copiados. Puedes pegarlos en la web de World Cars.");
    } catch (err) {
      alert("No se pudieron copiar los datos");
    }
  };

  const renderData = (data, title) => (
    <div style={{ background: "#fff", padding: "1.5rem", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", marginTop: "2rem" }}>
      <h3>{title}</h3>
      {Array.isArray(data)
        ? data.map((item, index) => (
            <div key={index} style={{ marginBottom: "1rem" }}>
              <h4>🔹 Elemento {index + 1}</h4>
              {Object.entries(item).map(([key, value]) => (
                <p key={key}>
                  <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </p>
              ))}
            </div>
          ))
        : Object.entries(data).map(([key, value]) => (
            <p key={key}>
              <strong>{key}:</strong> {typeof value === "object" ? JSON.stringify(value) : String(value)}
            </p>
          ))}
    </div>
  );

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <img src="https://www.worldcars.es/images/logo.png" alt="World Cars" style={{ height: "70px" }} />
        <h1>Consulta por VIN</h1>
        <p>Ficha técnica + Equipamiento OEM (VINDecoder.eu API 3.2)</p>
      </div>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <input
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Introduce el VIN"
          style={{ flex: 1, padding: "0.5rem" }}
        />
        <button onClick={handleCheckVin} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          Ficha técnica
        </button>
        <button onClick={handleOEMLookup} disabled={loading} style={{ padding: "0.5rem 1rem" }}>
          Equipamiento OEM
        </button>
      </div>

      {carData && renderData(carData, "Ficha técnica")}
      {oemData && renderData(oemData, "Equipamiento OEM")}

      {(carData || oemData) && (
        <div style={{ textAlign: "right", marginTop: "1rem" }}>
          <button onClick={handleEnviarAWC} disabled={submitted} style={{ padding: "0.5rem 1rem" }}>
            {submitted ? "Enviado ✔" : "Enviar a web World Cars"}
          </button>
        </div>
      )}
    </div>
  );
}
