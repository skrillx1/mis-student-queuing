let currentNum = 1;

export default defineEventHandler(() => {
  currentNum++;

  const current = `${String(currentNum).padStart(3, "0")}`;
  const next = `${String(currentNum + 1).padStart(3, "0")}`;

  return { current, next };
});
