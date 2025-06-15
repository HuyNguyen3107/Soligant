import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import AppRoutes from "./routes/AppRoutes"; // Sẽ tạo trong bước tiếp theo
import ScrollToTop from "./components/ScrollToTop";
import AuthInitializer from "./components/auth/AuthInitializer";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <ScrollToTop />
          <AppRoutes />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App;
