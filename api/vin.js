// archivo: /api/vin.js

export default async function handler(req, res) {
  const { vin } = req.query;

  if (!vin || vin.length < 10) {
    return res.status(400).json({ error: "VIN no válido" });
  }

  const user = "bd5626317e2f";
  const secret = "59f8372fc4";

  try {
    const response = await fetch(
      `https://api.vindecoder.eu/2.0/decode_vin?vin=${vin}&user=${user}&secret=${secret}&lang=es&output=json`
    );
    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: "Error consultando la API externa" });
  }
}
