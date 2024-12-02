"use client";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import React from "react";
import { atom, useAtom } from "jotai";
import { isSearchingAtom, searchValueAtom } from "@/lib/atoms";

const SearchBar = () => {
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [, setIsSearching] = useAtom(isSearchingAtom);
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
        <div className="absolute right-2 top-1 flex items-center gap-2">
          <button
            className="rounded-full p-2 hover:bg-accent hover:text-accent-foreground"
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
