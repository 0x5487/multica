import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Snippet } from "svelte";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export type WithElementRef<T, E = HTMLElement> = T & {
	ref?: E | null;
};

/** Omit children and child snippet props (for wrapper components). */
export type WithoutChildrenOrChild<T> = Omit<T, "children" | "child">;

/** Omit children snippet prop. */
export type WithoutChildren<T> = Omit<T, "children">;

/** Omit child snippet prop. */
export type WithoutChild<T> = Omit<T, "child">;
