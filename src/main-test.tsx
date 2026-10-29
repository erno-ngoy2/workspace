import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function App() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0B0F19', color: '#E8E6E3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'sans-serif' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '16px' }}>Blog Erno Ngoy</h1>
        <p style={{ fontSize: '18px', color: '#9BA3B5' }}>Le serveur fonctionne correctement !</p>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
