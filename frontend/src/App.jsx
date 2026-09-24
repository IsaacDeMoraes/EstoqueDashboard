import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Produtos from "./pages/Produtos";
import "./App.css";

export default function App() {
  const [pagina, setPagina] = useState("dashboard");

  return (
    <div className="app">
      <header className="app-header">
        <h1>Estoque Dashboard</h1>
        <nav>
          <button
            className={pagina === "dashboard" ? "ativo" : ""}
            onClick={() => setPagina("dashboard")}
          >
            Dashboard
          </button>
          <button
            className={pagina === "produtos" ? "ativo" : ""}
            onClick={() => setPagina("produtos")}
          >
            Produtos
          </button>
        </nav>
      </header>

      <main className="app-main">
        {pagina === "dashboard" ? <Dashboard /> : <Produtos />}
      </main>
    </div>
  );
}
