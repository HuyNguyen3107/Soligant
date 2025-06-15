// src/components/auth/AuthInitializer.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "../../redux/features/authSlice";

/**
 * Component để initialize auth check khi app khởi động
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components
 * @returns {JSX.Element}
 */
const AuthInitializer = ({ children }) => {
  const dispatch = useDispatch();
  const { authChecked } = useSelector((state) => state.auth);

  useEffect(() => {
    // Chỉ check auth một lần khi app khởi động
    if (!authChecked) {
      dispatch(initializeAuth());
    }
  }, [dispatch, authChecked]);

  return children;
};

export default AuthInitializer;
