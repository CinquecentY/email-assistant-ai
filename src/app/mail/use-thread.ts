import { configAtom } from "@/lib/atoms";
import { useAtom } from "jotai";

// For Managing single Thread by threadId

export function useThread() {
  return useAtom(configAtom);
}
