import { Route, Routes } from "react-router-dom"
import RestaurantDirectory from "./pages/RestaurantDirectory"
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage"

function App() {
  return (
    <Routes>
      <Route path="/" element={<RestaurantDirectory />} />
      <Route
        path="/restaurants/:id"
        element={<RestaurantDetailsPage />}
      />
    </Routes>
  )
}

export default App
