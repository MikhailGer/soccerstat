import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import { CompetitionMatchesPage } from './pages/CompetitionMatchesPage'
import { CompetitionsPage } from './pages/CompetitionsPage'
import { TeamMatchesPage } from './pages/TeamMatchesPage'
import { TeamsPage } from './pages/TeamsPage'
import './App.css'

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="topbar__label">SoccerStat</p>
          <p className="topbar__subtitle">
            Статистика по лигам и командам в одном интерфейсе
          </p>
        </div>

        <nav className="topbar__nav" aria-label="Основная навигация">
          <NavLink
            to="/competitions"
            className={({ isActive }) =>
              isActive ? 'topbar__link topbar__link--active' : 'topbar__link'
            }
          >
            Лиги
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              isActive ? 'topbar__link topbar__link--active' : 'topbar__link'
            }
          >
            Команды
          </NavLink>
        </nav>
      </header>

      <main className="content">
        <Routes>
          <Route path="/" element={<Navigate to="/competitions" replace />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route
            path="/competitions/:competitionId"
            element={<CompetitionMatchesPage />}
          />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/teams/:teamId" element={<TeamMatchesPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
