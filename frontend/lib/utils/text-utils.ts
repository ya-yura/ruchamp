export function getInitials(firstName: string, lastName: string): string {
  if (!firstName || !lastName) return '';
  const firstInitial = firstName.charAt(0);
  const lastInitial = lastName.charAt(0);
  return `${lastInitial}${firstInitial}`;
}
