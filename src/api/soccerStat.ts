import axios from 'axios'
import { apiClient } from './client'
import type {
  Competition,
  CompetitionMatchesResponse,
  CompetitionsResponse,
  Team,
  TeamMatchesResponse,
  TeamsResponse,
} from '../types/football'

interface DateRange {
  dateFrom?: string
  dateTo?: string
}

function ensureApiToken() {
  const token = import.meta.env.VITE_API_TOKEN?.trim()

  if (!token) {
    throw new Error(
      'Не найден VITE_API_TOKEN. Добавь токен в .env, чтобы загружать данные из football-data.org.',
    )
  }
}

function getResponseMessage(error: unknown) {
  if (
    axios.isAxiosError(error) &&
    error.response?.data &&
    typeof error.response.data === 'object' &&
    'message' in error.response.data &&
    typeof error.response.data.message === 'string' &&
    error.response.data.message.trim()
  ) {
    return error.response.data.message.trim()
  }

  return null
}

function toApplicationError(error: unknown) {
  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    const responseMessage = getResponseMessage(error)

    if (status === 401 || status === 403) {
      return new Error(
        responseMessage ??
          'API отклонил запрос. Проверь корректность токена в .env и права доступа.',
      )
    }

    if (status === 429) {
      return new Error(
        responseMessage ??
          'Превышен лимит запросов к API. Подожди немного и попробуй снова.',
      )
    }

    if (responseMessage) {
      return new Error(responseMessage)
    }

    return new Error('Не удалось получить данные с сервера. Попробуй позже.')
  }

  if (error instanceof Error) {
    return error
  }

  return new Error('Произошла неизвестная ошибка при загрузке данных.')
}

function getDateRangeParams({ dateFrom, dateTo }: DateRange) {
  if (dateFrom && dateTo) {
    return { dateFrom, dateTo }
  }

  return undefined
}

export async function fetchCompetitions() {
  ensureApiToken()

  try {
    const { data } = await apiClient.get<CompetitionsResponse>('/competitions')

    return data.competitions.toSorted((left, right) =>
      left.name.localeCompare(right.name, 'ru-RU'),
    )
  } catch (error) {
    throw toApplicationError(error)
  }
}

export async function fetchTeams() {
  ensureApiToken()

  try {
    const { data } = await apiClient.get<TeamsResponse>('/teams')

    return data.teams.toSorted((left, right) =>
      left.name.localeCompare(right.name, 'ru-RU'),
    )
  } catch (error) {
    throw toApplicationError(error)
  }
}

export async function fetchCompetitionMatches(
  competitionId: string,
  dateRange: DateRange = {},
) {
  ensureApiToken()

  try {
    const { data } = await apiClient.get<CompetitionMatchesResponse>(
      `/competitions/${competitionId}/matches`,
      {
        params: getDateRangeParams(dateRange),
      },
    )

    return {
      competition: data.competition,
      total: data.resultSet.count,
      matches: data.matches.toSorted((left, right) =>
        left.utcDate.localeCompare(right.utcDate),
      ),
    }
  } catch (error) {
    throw toApplicationError(error)
  }
}

export async function fetchTeam(teamId: string) {
  ensureApiToken()

  try {
    const { data } = await apiClient.get<Team>(`/teams/${teamId}`)

    return data
  } catch (error) {
    throw toApplicationError(error)
  }
}

export async function fetchTeamMatches(teamId: string, dateRange: DateRange = {}) {
  ensureApiToken()

  try {
    const { data } = await apiClient.get<TeamMatchesResponse>(
      `/teams/${teamId}/matches`,
      {
        params: getDateRangeParams(dateRange),
      },
    )

    return {
      total: data.resultSet.count,
      matches: data.matches.toSorted((left, right) =>
        left.utcDate.localeCompare(right.utcDate),
      ),
    }
  } catch (error) {
    throw toApplicationError(error)
  }
}

export function getCompetitionSearchText(competition: Competition) {
  return `${competition.name} ${competition.area.name} ${competition.code}`
}

export function getTeamSearchText(team: Team) {
  return `${team.name} ${team.shortName} ${team.tla}`
}
