import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import SignInPage from "./pages/SignInPage";
import ConsentPage from "./pages/ConsentPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/consent" element={<ConsentPage />} />

        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
