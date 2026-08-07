import { v4 as uuidv4 } from "uuid";
import { getLocale, isKorean } from "../i18n";

// Generate a 6-character room code for trips
export const generateRoomCode = (): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate unique ID
export const generateId = (): string => {
  return uuidv4();
};

export const formatAmount = (amount: number): string => {
  const formattedAmount = new Intl.NumberFormat(isKorean ? "ko-KR" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Math.abs(amount));

  return `${amount < 0 ? "-" : ""}$${formattedAmount}`;
};

export const formatCompactAmount = (amount: number): string => {
  const formattedAmount = new Intl.NumberFormat(isKorean ? "ko-KR" : "en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(Math.abs(amount));

  return `${amount < 0 ? "-" : ""}$${formattedAmount}`;
};

// Format date
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat(isKorean ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

export const formatExpenseDate = (date: Date): string => {
  const year = String(date.getFullYear()).slice(-2);
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
};

// Calculate time ago
export const timeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (getLocale() === "ko") {
    if (diffInSeconds < 60) return "방금 전";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)}분 전`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}시간 전`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}일 전`;
  } else {
    if (diffInSeconds < 60) return "just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000)
      return `${Math.floor(diffInSeconds / 86400)}d ago`;
  }

  return formatDate(date);
};

// Validate room code format
export const isValidRoomCode = (code: string): boolean => {
  return /^[A-Z0-9]{6}$/.test(code);
};
