import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import NewArrivals from "./pages/NewArrivals";
import Suits from "./pages/Suits";
import Shoes from "./pages/Shoes";
import Accessories from "./pages/Accessories";
import HeartList from "./pages/HeartList";
import AdminDashboardPage from "./admin/pages/AdminDashboardPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "new-arrivals", Component: NewArrivals },
      { path: "suits", Component: Suits },
      { path: "shoes", Component: Shoes },
      { path: "accessories", Component: Accessories },
      { path: "heart-list", Component: HeartList },
      { path: "wishlist", Component: HeartList },
    ],
  },
  {
    path: "/admin",
    Component: AdminDashboardPage,
  },
]);
