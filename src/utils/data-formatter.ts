// @/utils/date-formatter.ts

export function formatRelativeDate(isoString: string): string {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return isoString;
  }

  // Получаем «сейчас» в локальном времени
  const now = new Date();

  // Обнуляем время, чтобы сравнивать именно дни
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  // Разница в миллисекундах, потом в днях
  const diffMs = startOfToday.getTime() - startOfDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  let label: string;

  if (diffDays === 0) {
    label = 'Сегодня';
  } else if (diffDays === 1) {
    label = 'Вчера';
  } else {
    // Склонение: 1 день, 2–4 дня, 5+ дней
    const n = diffDays;
    if (n % 10 === 1 && n % 100 !== 11) {
      label = `${n} день назад`;
    } else if ([2, 3, 4].includes(n % 10) && !(n % 100 >= 12 && n % 100 <= 14)) {
      label = `${n} дня назад`;
    } else {
      label = `${n} дней назад`;
    }
  }

  const timeString = date.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return `${label}, ${timeString} i-GMT+03`;
}
