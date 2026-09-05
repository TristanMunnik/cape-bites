
function App() {

  const restaurants = [
    {
      id: 1,
      name: 'Example Restaurant',
      cuisine: 'Japanese',
      neighborhood: 'Cape Town',
      priceRange: '$$',
      rating: 4.5,
    },
  ]


  return (
    <>
      <main>
        <header>
          <h1>Cape Bites</h1>
          <p>Discover Asian restaurants in Cape Town.</p>
        </header>

        <section>
          {restaurants.map((restaurant) => (
            <article key={restaurant.id}>
              <h2>{restaurant.name}</h2>
              <p>{restaurant.cuisine}</p>
            </article>
          ))}
        </section>
      </main>

    </>
  )
}

export default App
