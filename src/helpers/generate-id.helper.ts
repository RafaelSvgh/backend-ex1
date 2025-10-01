export function generarID(longitud = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < longitud; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}