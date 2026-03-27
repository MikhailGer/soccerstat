import { useState } from 'react'

interface DateRangeFilterProps {
  appliedDateFrom?: string
  appliedDateTo?: string
  onApply: (dateRange: { dateFrom?: string; dateTo?: string }) => void
}

export function DateRangeFilter({
  appliedDateFrom,
  appliedDateTo,
  onApply,
}: DateRangeFilterProps) {
  const [dateFrom, setDateFrom] = useState(appliedDateFrom ?? '')
  const [dateTo, setDateTo] = useState(appliedDateTo ?? '')

  const isIncomplete = Boolean((dateFrom && !dateTo) || (!dateFrom && dateTo))
  const isInvalidRange = Boolean(dateFrom && dateTo && dateFrom > dateTo)
  const isSubmitDisabled = isIncomplete || isInvalidRange

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isSubmitDisabled) {
      return
    }

    onApply({
      dateFrom: dateFrom || undefined,
      dateTo: dateTo || undefined,
    })
  }

  function handleReset() {
    setDateFrom('')
    setDateTo('')
    onApply({})
  }

  return (
    <form className="date-filter" onSubmit={handleSubmit}>
      <div className="date-filter__fields">
        <label className="date-filter__field">
          <span>Дата с</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(event) => setDateFrom(event.target.value)}
          />
        </label>

        <label className="date-filter__field">
          <span>Дата по</span>
          <input
            type="date"
            value={dateTo}
            onChange={(event) => setDateTo(event.target.value)}
          />
        </label>
      </div>

      <div className="date-filter__actions">
        <button
          type="submit"
          className="action-button action-button--primary"
          disabled={isSubmitDisabled}
        >
          Применить
        </button>
        <button
          type="button"
          className="action-button"
          onClick={handleReset}
          disabled={!dateFrom && !dateTo}
        >
          Сбросить
        </button>
      </div>

      <p className="date-filter__hint">
        {isIncomplete
          ? 'Для фильтрации по API заполни обе даты.'
          : isInvalidRange
            ? 'Дата "с" должна быть раньше или равна дате "по".'
            : 'Если даты не заданы, показываем все доступные матчи.'}
      </p>
    </form>
  )
}
