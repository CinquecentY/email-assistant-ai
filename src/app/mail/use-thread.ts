import { configAtom } from "@/lib/atoms";
import { useAtom } from "jotai";


export function useThread() {
  return useAtom(configAtom);
}
