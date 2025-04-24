
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
    if (!vin || vin.length < 10) return
    setLoading(true)
    try {
      const res = await fetch(`https://api.vindecoder.eu/2.0/decode_vin?vin=${vin}&user=bd5626317e2f&secret=59f8372fc4&lang=es&output=json`)
      const data = await res.json()
      if (data && data.success && data.specification) {
        setCarData(data.specification)
      } else {
        alert("No se pudieron obtener datos del VIN")
      }
    } catch (err) {
      alert("Error consultando el VIN")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <img src="https://www.worldcars.es/images/logo.png" alt="World Cars" className="mx-auto h-16 mb-2" />
          <h1 className="text-3xl font-bold text-slate-800">Consulta Técnica por VIN</h1>
          <p className="text-slate-600">Herramienta interna de World Cars conectada con VINDecoder.eu</p>
        </div>

        <div className="flex gap-2 mb-4">
          <Input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="Introduce el VIN"
            className="flex-1"
          />
          <Button onClick={handleCheckVin} disabled={loading}>
            {loading ? "Buscando..." : "Consultar"}
          </Button>
        </div>

        {carData && (
          <Card className="bg-white shadow-xl rounded-2xl p-4">
            <CardContent className="space-y-2">
              {Object.entries(carData).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {String(value)}</p>
              ))}
              <div className="mt-4">
                <Textarea
                  value={JSON.stringify(carData, null, 2)}
                  readOnly
                  className="text-sm font-mono"
                />
              </div>
              <div className="text-right mt-4">
                <Button variant="outline" onClick={() => navigator.clipboard.writeText(JSON.stringify(carData, null, 2))}>
                  Copiar JSON
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
