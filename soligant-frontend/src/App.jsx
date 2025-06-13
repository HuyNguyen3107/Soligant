import { Provider } from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import store from "./redux/store";
import AppRoutes from "./routes/AppRoutes"; // Sẽ tạo trong bước tiếp theo
import ScrollToTop from "./components/ScrollToTop";
import AuthInitializer from "./components/auth/AuthInitializer";
import "./index.css";

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AuthInitializer>
          <ScrollToTop />
          <AppRoutes />
        </AuthInitializer>
      </Router>
    </Provider>
  );
}

export default App;
