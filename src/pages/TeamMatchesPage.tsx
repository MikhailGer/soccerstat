import { StatusPanel } from '../components/StatusPanel'

export function TeamMatchesPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 4</span>
        <h1>Календарь Команды</h1>
        <p>
          На этой странице дальше подключим данные по матчам команды, статусам
          и локальному времени пользователя.
        </p>
      </div>

      <StatusPanel
        title="Страница в работе"
        description="После списков лиг и команд логично перейти к календарям и общим компонентам для матчей."
      />
    </section>
  )
}
