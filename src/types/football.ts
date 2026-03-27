export interface Area {
  name: string
}

export interface Competition {
  id: number
  name: string
  code: string
  type: string
  emblem: string | null
  area: Area
}

export interface Team {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string | null
  venue: string | null
  area?: Area
}

export interface MatchTeam {
  id: number
  name: string
  shortName: string
  tla: string
  crest: string | null
}

export interface MatchScoreTime {
  home: number | null
  away: number | null
}

export interface MatchScore {
  winner: string | null
  duration: string
  fullTime: MatchScoreTime
  extraTime?: MatchScoreTime
  penalties?: MatchScoreTime
}

export interface Match {
  id: number
  utcDate: string
  status: string
  matchday?: number | null
  competition: Competition
  homeTeam: MatchTeam
  awayTeam: MatchTeam
  score: MatchScore
}

export interface ResultSet {
  count: number
}

export interface CompetitionsResponse {
  count: number
  competitions: Competition[]
}

export interface TeamsResponse {
  count: number
  teams: Team[]
}

export interface CompetitionMatchesResponse {
  resultSet: ResultSet
  competition: Competition
  matches: Match[]
}

export interface TeamMatchesResponse {
  resultSet: ResultSet
  matches: Match[]
}
