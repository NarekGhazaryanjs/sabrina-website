export function validateCredentials(login: string, password: string): boolean {
  return (
    login.trim().toLowerCase() === process.env.ADMIN_LOGIN?.toLowerCase() &&
    password === process.env.ADMIN_PASSWORD
  );
}
