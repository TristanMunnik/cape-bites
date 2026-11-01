// Restaurants without a known price are stored as 'Price not listed'.
export function hasListedPrice(restaurant) {
    return Boolean(restaurant.priceRange) && restaurant.priceRange !== 'Price not listed'
}
