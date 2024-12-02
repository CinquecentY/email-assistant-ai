import { configAtom } from "@/lib/atoms";
import { atom, useAtom } from "jotai";


export function useThread() {
  return useAtom(configAtom);
}
