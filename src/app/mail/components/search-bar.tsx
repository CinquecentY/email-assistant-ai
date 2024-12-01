"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Loader2, Search, X } from "lucide-react";
import React from "react";
import useThreads from "../use-threads";
import { atom, useAtom } from "jotai";

export const isSearchingAtom = atom(false);
export const searchValueAtom = atom("");

const SearchBar = () => {
  const { isFetching } = useThreads();
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const ref = React.useRef<HTMLInputElement>(null);
  const handleBlur = () => {
    if (!!searchValue) return;
    setIsSearching(false);
  };

  return (
    <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <motion.div className="relative" layoutId="search-bar">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          ref={ref}
          placeholder="Search"
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onBlur={handleBlur}
          autoComplete="search"
        />
        <div className="absolute right-2 top-2.5 flex items-center gap-2">
          {isFetching && (
            <span>
              <span className="sr-only">Fetching emails...</span>
              <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
            </span>
          )}
          <button
            className="rounded-sm hover:bg-gray-800"
            onClick={() => {
              setSearchValue("");
              setIsSearching(false);
              ref.current?.blur();
            }}
            aria-label="close"
          >
            <X className="size-4 text-gray-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default SearchBar;
