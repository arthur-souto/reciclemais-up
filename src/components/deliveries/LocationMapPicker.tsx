import { useEffect } from 'react'
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

const markerDefaultIcon = L.icon({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})

// Centro aproximado do Brasil, usado enquanto nenhuma localização foi escolhida.
const DEFAULT_CENTER: [number, number] = [-14.235, -51.9253]

interface LocationMapPickerProps {
  latitude: number | null
  longitude: number | null
  onChange: (lat: number, lng: number) => void
}

function ClickHandler({ onChange }: { onChange: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(event) {
      onChange(event.latlng.lat, event.latlng.lng)
    },
  })
  return null
}

function RecenterOnChange({ position }: { position: [number, number] }) {
  const map = useMap()

  useEffect(() => {
    map.setView(position, Math.max(map.getZoom(), 12))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [position[0], position[1]])

  return null
}

export function LocationMapPicker({ latitude, longitude, onChange }: LocationMapPickerProps) {
  const hasPosition = latitude != null && longitude != null && !Number.isNaN(latitude) && !Number.isNaN(longitude)
  const position: [number, number] = hasPosition ? [latitude, longitude] : DEFAULT_CENTER

  return (
    <div className="h-56 w-full overflow-hidden rounded-lg border border-border">
      <MapContainer center={position} zoom={hasPosition ? 13 : 4} scrollWheelZoom={false} className="size-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickHandler onChange={onChange} />
        {hasPosition && (
          <>
            <Marker
              position={position}
              icon={markerDefaultIcon}
              draggable
              eventHandlers={{
                dragend: (event) => {
                  const { lat, lng } = event.target.getLatLng()
                  onChange(lat, lng)
                },
              }}
            />
            <RecenterOnChange position={position} />
          </>
        )}
      </MapContainer>
    </div>
  )
}
