// utils/age.js
export function calculateAge(birthDateString) {
  if (!birthDateString) return null;

  const birth = new Date(birthDateString);
  const today = new Date();
  let years = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years--;
  }

  return years;
}
