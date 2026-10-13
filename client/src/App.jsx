import { Route, Routes } from "react-router-dom"
import AccountNavigation from "./components/AccountNavigation"
import AuthPage from "./pages/AuthPage"
import RestaurantDirectory from "./pages/RestaurantDirectory"
import RestaurantDetailsPage from "./pages/RestaurantDetailsPage"

function App() {
  return (
    <>
      <AccountNavigation />
      <Routes>
        <Route path="/" element={<RestaurantDirectory />} />
        <Route
          path="/restaurants/:id"
          element={<RestaurantDetailsPage />}
        />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Routes>
    </>
  )
}

export default App
