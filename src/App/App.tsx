import "../Styles/index.scss";
import "./Styles.scss";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { CreateUser } from "../Components/Pages/CreateUser";
import { Login } from "../Components/Pages/Login/Login";
import { UserProvider } from "../Contexts/UserContext";
import { SearchProvider } from "../Contexts/SearchContext";
import ProtectedPages from "../Components/ProtectedPages";
import { Header } from "../Components/Widgets/Header/Header";
import { Home } from "../Components/Pages/Home/Home";
import { Footer } from "../Components/Widgets/Footer/Footer";
import { Films } from "../Components/Pages/Films/Films";
import { Profile } from "../Components/Pages/Profile/Profile";
import { Threads } from "../Components/Pages/Threads/Threads";

function AppComponent() {
  return (
    <SearchProvider>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<WrappPages />}>
              <Route index element={<Home />} />
              <Route
                path="/films"
                element={
                  <ProtectedPages>
                    <Films />
                  </ProtectedPages>
                }
              />
              <Route
                path="/threads"
                element={
                  <ProtectedPages>
                    <Threads />
                  </ProtectedPages>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedPages>
                    <Profile />
                  </ProtectedPages>
                }
              />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/createUser" element={<CreateUser />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </SearchProvider>
  );
}

function WrappPages() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
    </>
  );
}

export const App = AppComponent;
