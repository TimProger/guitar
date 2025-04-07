import HomePage from "pages/home";
import "./_vars.scss";
import "./_globals.scss";
import React from "react";
import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  
  return (<div>
    <Routes>
      <Route
        path="/"
        element={<HomePage />}
      />
    </Routes>
  </div>
  );
}

export default App;
