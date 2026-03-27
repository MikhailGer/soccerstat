import type { Match, MatchScoreTime } from '../types/football'

const matchStatuses: Record<string, string> = {
  SCHEDULED: 'Запланирован',
  TIMED: 'Запланирован',
  LIVE: 'В прямом эфире',
  IN_PLAY: 'В игре',
  PAUSED: 'Пауза',
  FINISHED: 'Завершен',
  POSTPONED: 'Отложен',
  SUSPENDED: 'Приостановлен',
  CANCELED: 'Отменен',
  AWARDED: 'Техническая победа',
}

function hasVisibleScore(score?: MatchScoreTime) {
  return Boolean(
    score &&
      score.home !== null &&
      score.home !== undefined &&
      score.away !== null &&
      score.away !== undefined,
  )
}

export function formatMatchDate(utcDate: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(utcDate))
}

export function formatMatchTime(utcDate: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(utcDate))
}

export function formatMatchStatus(status: string) {
  return matchStatuses[status] ?? status
}

export function getVisibleScores(match: Match) {
  const scores: Array<{ label: string; value: string }> = []

  if (hasVisibleScore(match.score.fullTime)) {
    scores.push({
      label: 'Основное время',
      value: `${match.score.fullTime.home}:${match.score.fullTime.away}`,
    })
  }

  if (hasVisibleScore(match.score.extraTime)) {
    scores.push({
      label: 'Доп. время',
      value: `${match.score.extraTime!.home}:${match.score.extraTime!.away}`,
    })
  }

  if (hasVisibleScore(match.score.penalties)) {
    scores.push({
      label: 'Пенальти',
      value: `${match.score.penalties!.home}:${match.score.penalties!.away}`,
    })
  }

  return scores
}
