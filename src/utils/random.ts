export function pickUniqueRandomItems<T>(items: T[], count: number): T[] {
  if (count <= 0) return [];
  if (count >= items.length) return [...items];

  const pool = [...items];
  const picked: T[] = [];

  while (picked.length < count) {
    const random = new Uint32Array(1);
    crypto.getRandomValues(random);
    const index = random[0] % pool.length;
    picked.push(pool[index]);
    pool.splice(index, 1);
  }

  return picked;
}
