import { DateFormatter } from '@internationalized/date';
import { type ClassValue, clsx } from 'clsx';
import { cubicOut } from 'svelte/easing';
import type { TransitionConfig } from 'svelte/transition';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
	y?: number;
	x?: number;
	start?: number;
	duration?: number;
};

export const flyAndScale = (
	node: Element,
	params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	const scaleConversion = (valueA: number, scaleA: [number, number], scaleB: [number, number]) => {
		const [minA, maxA] = scaleA;
		const [minB, maxB] = scaleB;

		const percentage = (valueA - minA) / (maxA - minA);
		const valueB = percentage * (maxB - minB) + minB;

		return valueB;
	};

	const styleToString = (style: Record<string, number | string | undefined>): string => {
		return Object.keys(style).reduce((str, key) => {
			if (style[key] === undefined) return str;
			return str + `${key}:${style[key]};`;
		}, '');
	};

	return {
		duration: params.duration ?? 200,
		delay: 0,
		css: (t) => {
			const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
			const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
			const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

			return styleToString({
				transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
				opacity: t
			});
		},
		easing: cubicOut
	};
};

export const dateFormat = (
	date: Date,
	dateStyle?: 'full' | 'long' | 'medium' | 'short'
): string => {
	return new DateFormatter('id-ID', {
		dateStyle: dateStyle ?? 'long',
		timeZone: 'Asia/Jakarta'
	}).format(date);
};

export const dateFormatString = (
	dateStr: string | undefined | null,
	dateStyle?: 'full' | 'long' | 'medium' | 'short'
): string => {
	if (!dateStr) return '';
	return dateFormat(new Date(`${dateStr}Z`), dateStyle);
};

export const dateTimeFormat = (date: Date): string => {
	return dateTimeFormatWithTz(date);
};

export const dateTimeFormatWithTz = (date: Date): string =>
	new DateFormatter('id-ID', {
		dateStyle: 'medium',
		timeStyle: 'long',
		timeZone: 'Asia/Jakarta'
	}).format(date);

export const dateTimeFormatString = (dateTimeStr: string | undefined | null): string => {
	if (!dateTimeStr) return '';
	return dateTimeFormat(new Date(`${dateTimeStr}Z`)).replaceAll('.', ':');
};

export const timeFormat = (date: Date): string =>
	new DateFormatter('id-ID', {
		hour: '2-digit',
		minute: '2-digit',
		hourCycle: 'h23',
		timeZoneName: 'short',
		timeZone: 'Asia/Jakarta'
	})
		.format(date)
		.replaceAll('.', ':');

export const timeFormatString = (timeStr: string | undefined | null): string => {
	if (!timeStr) return '';
	return timeFormat(new Date(`${timeStr}Z`));
};

let debounceTimer: ReturnType<typeof setTimeout>;
export const debounce = (callback: () => void, timeout?: number) => {
	clearTimeout(debounceTimer);
	debounceTimer = setTimeout(() => {
		callback();
	}, timeout || 800);
};

// Function to format time
export function formatTime(date: Date): string {
	const hours = String(date.getHours()).padStart(2, '0');
	const minutes = String(date.getMinutes()).padStart(2, '0');
	const seconds = String(date.getSeconds()).padStart(2, '0');
	return `${hours}:${minutes}:${seconds}`;
}

// Function to format date
export function formatDate(date: Date): string {
	const year = date.getFullYear();
	const months = [
		'Januari',
		'Februari',
		'Maret',
		'April',
		'Mei',
		'Juni',
		'Juli',
		'Agustus',
		'September',
		'Oktober',
		'November',
		'Desember'
	];
	const month = months[date.getMonth()];
	const day = String(date.getDate()).padStart(2, '0');
	return `${day} ${month} ${year}`;
}

// Function to get the day of the week
export function getDayOfWeek(date: Date): string {
	const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
	return days[date.getDay()];
}
