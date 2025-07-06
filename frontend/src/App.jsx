// import { useState } from 'react'

import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>

//     </>
//   )
// }

// export default App
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './components/AuthPage.jsx';
import LandingPage from './components/LandingPage.jsx';
import DashboardCharts from './components/DashboardCharts.jsx';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/upload" element={<LandingPage />} /> {/* LandingPage moved to /upload */}
        <Route path="/dashboard" element={<DashboardCharts />} /> {/* New Dashboard route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
