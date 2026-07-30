import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { RecyclingCenter } from '@/lib/recyclingCenters'

const userLocationIcon = L.divIcon({
  className: '',
  html: `
    <div class="map-user-marker">
      <span class="map-user-marker-pulse"></span>
      <span class="map-user-marker-dot"></span>
    </div>
  `,
  iconSize: [18, 18],
  iconAnchor: [9, 9],
})

const recyclingCenterIcon = L.divIcon({
  className: '',
  html: `<div class="map-recycling-marker">♻️</div>`,
  iconSize: [34, 34],
  iconAnchor: [17, 17],
  popupAnchor: [0, -17],
})

interface RecyclingCentersMapProps {
  userLocation: { lat: number; lon: number }
  centers: RecyclingCenter[]
  focusedCenterId: number | null
}

function FitBounds({
  userLocation,
  centers,
}: {
  userLocation: { lat: number; lon: number }
  centers: RecyclingCenter[]
}) {
  const map = useMap()

  useEffect(() => {
    const points: [number, number][] = [
      [userLocation.lat, userLocation.lon],
      ...centers.map((center): [number, number] => [center.lat, center.lon]),
    ]

    if (points.length === 1) {
      map.setView(points[0], 14)
      return
    }

    map.fitBounds(L.latLngBounds(points), { padding: [32, 32], maxZoom: 15 })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userLocation.lat, userLocation.lon, centers])

  return null
}

function FlyToCenter({ center }: { center: RecyclingCenter | null }) {
  const map = useMap()

  useEffect(() => {
    if (center) {
      map.flyTo([center.lat, center.lon], 16, { duration: 0.6 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [center])

  return null
}

export function RecyclingCentersMap({ userLocation, centers, focusedCenterId }: RecyclingCentersMapProps) {
  const focusedCenter = centers.find((center) => center.id === focusedCenterId) ?? null

  return (
    <div className="h-80 w-full overflow-hidden rounded-xl border border-border sm:h-96">
      <MapContainer
        center={[userLocation.lat, userLocation.lon]}
        zoom={13}
        scrollWheelZoom={false}
        className="size-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[userLocation.lat, userLocation.lon]} icon={userLocationIcon}>
          <Popup>Você está aqui</Popup>
        </Marker>

        {centers.map((center) => (
          <Marker key={center.id} position={[center.lat, center.lon]} icon={recyclingCenterIcon}>
            <Popup>
              <span className="font-medium">{center.name}</span>
              {center.address && <div className="text-xs text-muted-foreground">{center.address}</div>}
            </Popup>
          </Marker>
        ))}

        <FitBounds userLocation={userLocation} centers={centers} />
        <FlyToCenter center={focusedCenter} />
      </MapContainer>
    </div>
  )
}
