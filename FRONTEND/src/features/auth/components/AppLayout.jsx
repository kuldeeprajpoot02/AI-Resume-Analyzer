
import { Outlet } from "react-router-dom";
import Footer from "./Footer";

function AppLayout() {
  return (
    <div>
      <Outlet />
      <Footer />
    </div>
  );
}

export default AppLayout;
