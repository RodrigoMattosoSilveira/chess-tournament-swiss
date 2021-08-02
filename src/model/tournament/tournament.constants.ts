export const TOURNAMENT_TYPE = {
    "ROUND-ROBIN": "ROUND-ROBIN",
    SWISS: "SWISS",
    ELIMINATION: "ELIMINATION",
    MATCH: "MATCH"
} as const

export const TOURNAMENT_STATE = {
    PLANNED: "PLANNED",
    SCHEDULED: "SCHEDULED",
    CLOSED: "CLOSED",
    UNDERWAY: "UNDERWAY",
    ENDED: "ENDED"
} as const

export const TOURNAMENT_DEFAULTS = {
    city: "",
    country:  "",
    rounds: 6,
    minRate:  0,
    maxPlayers: 1024,
    maxRate:  Number.MAX_VALUE,
    type:  TOURNAMENT_TYPE.SWISS,
    tournamentPlayers: 8,
    players: [],
    state:  TOURNAMENT_STATE.PLANNED,
    winPoints:  1,
    tiePoints:  0.5,
    scheduledStartDate: 0,
    scheduledEndDate: 0,
    actualStartDate: 0,
    actualEndDate: 0
} as const

export const TOURNAMENT_LIMITS = {
    rounds: 24,
    maxTournamentPlayers: 1024,
    minRate:  0,
    maxRate:  Number.MAX_VALUE
} as const
