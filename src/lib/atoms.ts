import { atom } from "jotai";
import { type Template } from "./types";

export const configAtom = atom<string | null>(null);
export const isSearchingAtom = atom(false);
export const searchValueAtom = atom("");
export const mailTabAtom = atom("mail");
export const isCollapsedAtom = atom(false);
export const templatesTabAtom = atom("templates");
export const templatesAtom = atom<Template[]>([])
