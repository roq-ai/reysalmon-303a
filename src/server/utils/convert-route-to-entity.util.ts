const mapping: Record<string, string> = {
  dishes: 'dish',
  menus: 'menu',
  restaurants: 'restaurant',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
