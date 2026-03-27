import { Navigate, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

function CompetitionsPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 1</span>
        <h1>Лиги</h1>
        <p>
          Здесь будет список соревнований с поиском, пагинацией и переходом в
          календарь выбранной лиги.
        </p>
      </div>
    </section>
  )
}

function CompetitionMatchesPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 2</span>
        <h1>Календарь Лиги</h1>
        <p>
          Следующим шагом подключим хлебные крошки, фильтр по датам и список
          матчей конкретного соревнования.
        </p>
      </div>
    </section>
  )
}

function TeamsPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 3</span>
        <h1>Команды</h1>
        <p>
          Эта страница станет точкой входа в каталог команд с поиском, логотипами
          и переходом к календарю команды.
        </p>
      </div>
    </section>
  )
}

function TeamMatchesPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 4</span>
        <h1>Календарь Команды</h1>
        <p>
          Здесь появятся матчи выбранной команды, фильтрация по диапазону дат и
          локальное время пользователя.
        </p>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div>
          <p className="topbar__label">SoccerStat</p>
          <p className="topbar__subtitle">
            Базовый каркас приложения для тестового задания
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
