import type { Match } from '../types/football'
import {
  formatMatchDate,
  formatMatchStatus,
  formatMatchTime,
  getVisibleScores,
} from '../utils/matches'

interface MatchesListProps {
  matches: Match[]
  showCompetition?: boolean
}

export function MatchesList({
  matches,
  showCompetition = false,
}: MatchesListProps) {
  return (
    <div className="matches-list">
      {matches.map((match) => {
        const scores = getVisibleScores(match)

        return (
          <article key={match.id} className="match-card">
            <div className="match-card__meta">
              <div>
                <p className="match-card__date">{formatMatchDate(match.utcDate)}</p>
                <p className="match-card__time">{formatMatchTime(match.utcDate)}</p>
              </div>

              <div className="match-card__badges">
                <span className="match-card__badge">
                  {formatMatchStatus(match.status)}
                </span>
                {match.matchday ? (
                  <span className="match-card__badge">Тур {match.matchday}</span>
                ) : null}
                {showCompetition ? (
                  <span className="match-card__badge">{match.competition.name}</span>
                ) : null}
              </div>
            </div>

            <div className="match-card__teams">
              <div className="match-team">
                <div className="match-team__logo">
                  {match.homeTeam.crest ? (
                    <img
                      src={match.homeTeam.crest}
                      alt={`Логотип ${match.homeTeam.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <span>{match.homeTeam.tla}</span>
                  )}
                </div>
                <p className="match-team__name">{match.homeTeam.name}</p>
              </div>

              <div className="match-card__score">
                {scores.length > 0 ? (
                  scores.map((score) => (
                    <p key={score.label}>
                      <span>{score.label}</span>
                      <strong>{score.value}</strong>
                    </p>
                  ))
                ) : (
                  <p>
                    <span>Счёт</span>
                    <strong>Не начался</strong>
                  </p>
                )}
              </div>

              <div className="match-team">
                <div className="match-team__logo">
                  {match.awayTeam.crest ? (
                    <img
                      src={match.awayTeam.crest}
                      alt={`Логотип ${match.awayTeam.name}`}
                      loading="lazy"
                    />
                  ) : (
                    <span>{match.awayTeam.tla}</span>
                  )}
                </div>
                <p className="match-team__name">{match.awayTeam.name}</p>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}
