// Backend test has GamesService methods, but GamesController and GameRealtimeHandler
// expose no start/state/turn/upload/finish entry points. Do not invent routes here.
// See docs/backend-integration.md before enabling game actions.
export const GAME_ACTIONS_AVAILABLE = false;
