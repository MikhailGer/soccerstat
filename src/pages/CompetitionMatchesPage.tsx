import { StatusPanel } from '../components/StatusPanel'

export function CompetitionMatchesPage() {
  return (
    <section className="page">
      <div className="page__header">
        <span className="page__eyebrow">Раздел 3</span>
        <h1>Календарь Лиги</h1>
        <p>
          Здесь следующим шагом появятся хлебные крошки, фильтр по датам и список
          матчей выбранного соревнования.
        </p>
      </div>

      <StatusPanel
        title="Страница в работе"
        description="Каркас уже готов. На следующем шаге подключим матчи лиги и фильтрацию по диапазону дат."
      />
    </section>
  )
}
