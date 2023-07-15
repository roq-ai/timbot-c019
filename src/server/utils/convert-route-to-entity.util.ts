const mapping: Record<string, string> = {
  bots: 'bot',
  organizations: 'organization',
  tokens: 'token',
  'trade-histories': 'trade_history',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
