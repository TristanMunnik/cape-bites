import { useEffect, useMemo, useRef, useState } from "react"
import { Link } from "react-router-dom"
import Map, { Marker, NavigationControl, Popup } from "react-map-gl/mapbox"
import "mapbox-gl/dist/mapbox-gl.css"

function fitRestaurants(map, restaurants) {
    if (!restaurants.length) return

    const bounds = restaurants.reduce((result, restaurant) => {
        const [longitude, latitude] = restaurant.location.coordinates
        result[0][0] = Math.min(result[0][0], longitude)
        result[0][1] = Math.min(result[0][1], latitude)
        result[1][0] = Math.max(result[1][0], longitude)
        result[1][1] = Math.max(result[1][1], latitude)
        return result
    }, [[Infinity, Infinity], [-Infinity, -Infinity]])

    map.fitBounds(bounds, { padding: 54, maxZoom: 13, duration: 900 })
}

function RestaurantMap({ restaurants, visible }) {
    const mapRef = useRef(null)
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const locations = useMemo(
        () => restaurants.filter((restaurant) => restaurant.location?.coordinates?.length === 2),
        [restaurants]
    )
    const accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

    useEffect(() => {
        if (!visible || !mapRef.current) return

        const frame = window.requestAnimationFrame(() => {
            const map = mapRef.current?.getMap()
            if (!map) return
            map.resize()
            fitRestaurants(map, locations)
        })

        return () => window.cancelAnimationFrame(frame)
    }, [locations, visible])

    return (
        <section
            className={`map-panel ${visible ? 'is-mobile-visible' : 'is-mobile-hidden'}`}
            aria-labelledby="map-heading"
        >
            <div className="map-panel-heading">
                <div>
                    <p className="eyebrow">Explore the city</p>
                    <h2 id="map-heading">Restaurant map</h2>
                </div>
                <span>{locations.length} mapped</span>
            </div>

            {accessToken ? (
                <div className="restaurant-map">
                    <Map
                        ref={mapRef}
                        style={{ width: "100%", height: "100%" }}
                        mapboxAccessToken={accessToken}
                        initialViewState={{ longitude: 18.4241, latitude: -33.9249, zoom: 11 }}
                        mapStyle="mapbox://styles/mapbox/standard"
                        onLoad={(event) => fitRestaurants(event.target, locations)}
                        cooperativeGestures
                        reuseMaps
                    >
                        <NavigationControl position="top-right" showCompass />
                        {locations.map((restaurant) => {
                            const [longitude, latitude] = restaurant.location.coordinates

                            return (
                                <Marker
                                    key={restaurant._id || restaurant.id}
                                    longitude={longitude}
                                    latitude={latitude}
                                    anchor="bottom"
                                    onClick={(event) => {
                                        event.originalEvent.stopPropagation()
                                        setSelectedRestaurant(restaurant)
                                    }}
                                >
                                    <button
                                        type="button"
                                        className="restaurant-map-marker"
                                        aria-label={`Show ${restaurant.name} on map`}
                                    />
                                </Marker>
                            )
                        })}
                        {selectedRestaurant && (
                            <Popup
                                longitude={selectedRestaurant.location.coordinates[0]}
                                latitude={selectedRestaurant.location.coordinates[1]}
                                anchor="top"
                                closeOnClick={false}
                                onClose={() => setSelectedRestaurant(null)}
                            >
                                <div className="restaurant-map-popup">
                                    <strong>{selectedRestaurant.name}</strong>
                                    <span>{selectedRestaurant.cuisine} · {selectedRestaurant.neighborhood}</span>
                                    <Link to={`/restaurants/${selectedRestaurant.id}`}>
                                        View restaurant
                                    </Link>
                                </div>
                            </Popup>
                        )}
                    </Map>
                </div>
            ) : (
                <div className="map-token-notice" role="status">
                    <strong>Mapbox token required</strong>
                    <span>Add <code>VITE_MAPBOX_ACCESS_TOKEN</code> to <code>client/.env</code> to load the map.</span>
                </div>
            )}
            <p className="map-note">
                Pins without verified coordinates are omitted. Map tiles © Mapbox.
            </p>
        </section>
    )
}

export default RestaurantMap
