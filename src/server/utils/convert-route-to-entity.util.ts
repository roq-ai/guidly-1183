const mapping: Record<string, string> = {
  organizations: 'organization',
  products: 'product',
  questions: 'question',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
