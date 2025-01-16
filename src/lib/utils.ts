import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DateFormatter } from "@internationalized/date";


export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const dateTimeFormat = (date: Date): string => {
	return dateTimeFormatWithTz(date);
};

export const dateTimeFormatWithTz = (date: Date): string =>
	new DateFormatter("id-ID", {
		dateStyle: "medium",
		timeStyle: "long",
		timeZone: 'Asia/Jakarta',
	}).format(date);

export const dateTimeFormatString = (dateTimeStr: string | undefined | null): string => {
	if (!dateTimeStr) return "";
	return dateTimeFormat(new Date(`${dateTimeStr}Z`)).replaceAll(".", ":");
};