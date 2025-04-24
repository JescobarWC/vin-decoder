
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

export default function VinDecoderDemo() {
  const [vin, setVin] = useState("")
  const [carData, setCarData] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCheckVin = async () => {
    setLoading(true)
    // Simulamos respuesta de SilverDAT o API externa
    setTimeout(() => {
      setCarData({
        marca: "Renault",
        modelo: "Clio",
        version: "Business Blue dCi 85 CV",
        combustible: "Diesel",
        emisiones: "95 g/km",
        motor: "1.5 dCi 85 CV",
        transmision: "Manual",
        carroceria: "Berlina 5 puertas",
        equipamiento: [
          "Control de crucero",
          "Sensor de aparcamiento trasero",
          "Pantalla táctil 7''",
          "Bluetooth y USB",
        ],
      })
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">🔍 Consulta Técnica por VIN</h1>
      <div className="flex gap-2 mb-4">
        <Input
          value={vin}
          onChange={(e) => setVin(e.target.value)}
          placeholder="Introduce el VIN"
        />
        <Button onClick={handleCheckVin} disabled={loading}>
          {loading ? "Buscando..." : "Consultar"}
        </Button>
      </div>

      {carData && (
        <Card className="mt-4">
          <CardContent className="space-y-2">
            <p><strong>Marca:</strong> {carData.marca}</p>
            <p><strong>Modelo:</strong> {carData.modelo}</p>
            <p><strong>Versión:</strong> {carData.version}</p>
            <p><strong>Combustible:</strong> {carData.combustible}</p>
            <p><strong>Motor:</strong> {carData.motor}</p>
            <p><strong>Transmisión:</strong> {carData.transmision}</p>
            <p><strong>Carrocería:</strong> {carData.carroceria}</p>
            <p><strong>Emisiones:</strong> {carData.emisiones}</p>
            <p><strong>Equipamiento destacado:</strong></p>
            <ul className="list-disc list-inside">
              {carData.equipamiento.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <div className="mt-4">
              <Textarea
                value={JSON.stringify(carData, null, 2)}
                readOnly
                className="text-sm"
              />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
