export function formatTimeAgo(input: string | number | Date, now = new Date()) {
  const date = input instanceof Date ? input : new Date(input);
  const diffMs = now.getTime() - date.getTime();

  if (!Number.isFinite(diffMs)) return "";
  if (diffMs < 0) return "방금 전";

  const sec = Math.floor(diffMs / 1000);
  const min = Math.floor(sec / 60);
  const hour = Math.floor(min / 60);
  const day = Math.floor(hour / 24);
  const week = Math.floor(day / 7);
  const month = Math.floor(day / 30);
  const year = Math.floor(day / 365);

  if (min < 1) return "방금 전";
  if (min < 60) return `${min}분 전`;
  if (hour < 24) return `${hour}시간 전`;
  if (day < 7) return `${day}일 전`;
  if (week < 5) return `${week}주 전`;
  if (month < 12) return month <= 1 ? "한 달 전" : `${month}달 전`;
  return year <= 1 ? "한 해 전" : `${year}년 전`;
}


