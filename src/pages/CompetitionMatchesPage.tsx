import { useQuery } from '@tanstack/react-query'
import { useParams, useSearchParams } from 'react-router-dom'
import { Breadcrumbs } from '../components/Breadcrumbs'
import { DateRangeFilter } from '../components/DateRangeFilter'
import { MatchesList } from '../components/MatchesList'
import { Pagination } from '../components/Pagination'
import { StatusPanel } from '../components/StatusPanel'
import { fetchCompetitionMatches } from '../api/soccerStat'
import { clampPage, getTotalPages, paginateItems } from '../utils/list'

const PAGE_SIZE = 10

function getPageFromSearchParams(searchParams: URLSearchParams) {
  const pageValue = Number(searchParams.get('page') ?? '1')

  return Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
}

export function CompetitionMatchesPage() {
  const { competitionId } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const dateFrom = searchParams.get('dateFrom') ?? undefined
  const dateTo = searchParams.get('dateTo') ?? undefined

  const competitionMatchesQuery = useQuery({
    queryKey: ['competitionMatches', competitionId, dateFrom, dateTo],
    queryFn: () => fetchCompetitionMatches(competitionId ?? '', { dateFrom, dateTo }),
    enabled: Boolean(competitionId),
  })

  const totalPages = getTotalPages(
    competitionMatchesQuery.data?.matches.length ?? 0,
    PAGE_SIZE,
  )
  const currentPage = clampPage(getPageFromSearchParams(searchParams), totalPages)
  const visibleMatches = paginateItems(
    competitionMatchesQuery.data?.matches ?? [],
    currentPage,
    PAGE_SIZE,
  )

  function updateDateRange(nextDateRange: {
    dateFrom?: string
    dateTo?: string
  }) {
    const nextSearchParams = new URLSearchParams(searchParams)

    nextSearchParams.delete('page')

    if (nextDateRange.dateFrom && nextDateRange.dateTo) {
      nextSearchParams.set('dateFrom', nextDateRange.dateFrom)
      nextSearchParams.set('dateTo', nextDateRange.dateTo)
    } else {
      nextSearchParams.delete('dateFrom')
      nextSearchParams.delete('dateTo')
    }

    setSearchParams(nextSearchParams)
  }

  function updatePage(nextPage: number) {
    const nextSearchParams = new URLSearchParams(searchParams)

    if (nextPage <= 1) {
      nextSearchParams.delete('page')
    } else {
      nextSearchParams.set('page', String(nextPage))
    }

    setSearchParams(nextSearchParams)
  }

  if (!competitionId) {
    return (
      <section className="page">
        <StatusPanel
          title="Не найдена лига"
          description="В адресе отсутствует идентификатор соревнования."
        />
      </section>
    )
  }

  const competitionName = competitionMatchesQuery.data?.competition.name ?? 'Календарь лиги'

  return (
    <section className="page">
      <Breadcrumbs
        items={[
          { label: 'Лиги', to: '/competitions' },
          { label: competitionName },
        ]}
      />

      <div className="page__header page__header--compact">
        <span className="page__eyebrow">Раздел 3</span>
        <h1>{competitionName}</h1>
        <p>
          Календарь матчей выбранной лиги с фильтрацией по диапазону дат и
          локальным временем пользователя.
        </p>
      </div>

      <div className="page__toolbar page__toolbar--stacked">
        <DateRangeFilter
          key={`${dateFrom ?? 'empty'}-${dateTo ?? 'empty'}`}
          appliedDateFrom={dateFrom}
          appliedDateTo={dateTo}
          onApply={updateDateRange}
        />
        <p className="page__meta">
          Матчей: <strong>{competitionMatchesQuery.data?.total ?? 0}</strong>
        </p>
      </div>

      {competitionMatchesQuery.isLoading ? (
        <StatusPanel
          title="Загружаем календарь"
          description="Получаем матчи выбранной лиги."
        />
      ) : null}

      {competitionMatchesQuery.isError ? (
        <StatusPanel
          title="Не удалось загрузить календарь"
          description={competitionMatchesQuery.error.message}
        />
      ) : null}

      {!competitionMatchesQuery.isLoading &&
      !competitionMatchesQuery.isError &&
      visibleMatches.length === 0 ? (
        <StatusPanel
          title="Матчи не найдены"
          description="Попробуй изменить диапазон дат или сбросить фильтр."
        />
      ) : null}

      {!competitionMatchesQuery.isLoading &&
      !competitionMatchesQuery.isError &&
      visibleMatches.length > 0 ? (
        <>
          <MatchesList matches={visibleMatches} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={updatePage}
          />
        </>
      ) : null}
    </section>
  )
}
