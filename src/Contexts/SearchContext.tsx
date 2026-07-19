import { createContext, useContext, useState, ReactNode } from "react";

interface SearchContextType {
  search: string;
  setSearch: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  performSearch: (query: string) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearch] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const performSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <SearchContext.Provider
      value={{
        search,
        setSearch,
        searchQuery,
        setSearchQuery,
        performSearch,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch must be used within SearchProvider");
  }
  return context;
}
