
const restaurants = [
  {
    id: 1,
    name: 'Kumo House',
    cuisine: 'Japanese',
    neighborhood: 'Gardens',
    priceRange: '$$',
    rating: 4.5,
    accent: 'saffron',
    description: 'Demo listing for ramen, small plates, and Japanese comfort food.',
  },
  {
    id: 2,
    name: 'Lotus Table',
    cuisine: 'Vietnamese',
    neighborhood: 'De Waterkant',
    priceRange: '$$',
    rating: 4.7,
    accent: 'coral',
    description: 'Demo listing for bright noodle bowls and fresh street-food flavours.',
  },
  {
    id: 3,
    name: 'Seoul Bird',
    cuisine: 'Korean',
    neighborhood: 'Woodstock',
    priceRange: '$$$',
    rating: 4.3,
    accent: 'jade',
    description: 'Demo listing for Korean barbecue, fried chicken, and shared plates.',
  },
  {
    id: 4,
    name: 'Mango & Rice',
    cuisine: 'Thai',
    neighborhood: 'Sea Point',
    priceRange: '$$',
    rating: 4.6,
    accent: 'indigo',
    description: 'Demo listing for fragrant curries and quick Thai-inspired lunches.',
  },
]

function App() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <p className="eyebrow">Cape Town food guide</p>
        <div className="header-row">
          <div>
            <h1>Cape Bites</h1>
            <p className="intro">Find your next favourite Asian meal in the Mother City.</p>
          </div>
          <span className="demo-badge">Demo directory</span>
        </div>
      </header>

      <section className="directory" aria-labelledby="directory-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A short list to start</p>
            <h2 id="directory-heading">Explore the directory</h2>
          </div>
          <p className="result-count">{restaurants.length} places</p>
        </div>

        <div className="restaurant-grid">
          {restaurants.map((restaurant) => (
            <article className="restaurant-card" key={restaurant.id}>
              <div className={`card-image ${restaurant.accent}`} aria-hidden="true">
                <span>{restaurant.cuisine}</span>
              </div>
              <div className="card-content">
                <div className="card-title-row">
                  <h3>{restaurant.name}</h3>
                  <span className="rating">★ {restaurant.rating}</span>
                </div>
                <p className="card-description">{restaurant.description}</p>
                <div className="card-meta">
                  <span>{restaurant.neighborhood}</span>
                  <span>{restaurant.priceRange}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  )
}

export default App
