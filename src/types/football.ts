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
}

export interface CompetitionsResponse {
  count: number
  competitions: Competition[]
}

export interface TeamsResponse {
  count: number
  teams: Team[]
}
