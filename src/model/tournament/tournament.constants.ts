import {ITournamentPatch} from "./tournament.interfaces";

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
    city: "St. Louis",
    country:  "US",
    rounds: 24,
    minRate:  0,
    maxRate:  Number.MAX_VALUE,
    type:  TOURNAMENT_TYPE.SWISS,
    players: [],
    state:  TOURNAMENT_STATE.PLANNED,
    winPoints:  1,
    tiePoints:  0.5,
} as const

