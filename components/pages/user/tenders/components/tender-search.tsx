import React, { useState, useCallback } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SectorEnum, TenderStatus } from '@/constant/text';
import { ClipLoader } from 'react-spinners';
import debounce from 'lodash/debounce';
import { SearchParams, SearchResult } from '@/types';

interface ComprehensiveTenderSearchProps {
  onSearch: (searchParams: SearchParams) => Promise<SearchResult>;
  isLoading: boolean;
}

const ComprehensiveTenderSearch: React.FC<ComprehensiveTenderSearchProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<SectorEnum | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<TenderStatus | null>(null);
  const [searchError, setSearchError] = useState<string | null>(null);

  const debouncedSearch = useCallback(
    debounce((searchParams: SearchParams) => {
      console.log("Debounced search triggered with params:", searchParams);
      performSearch(searchParams);
    }, 300),
    [onSearch]
  );

  const performSearch = async (searchParams: SearchParams) => {
    setSearchError(null);
    try {
      const result = await onSearch(searchParams);
      if (result.error) {
        setSearchError(result.error);
      }
    } catch (error) {
      console.error("Error during search:", error);
      setSearchError("An unexpected error occurred");
    }
  };

  const handleSearch = () => {
    console.log("Manual search triggered");
    performSearch({
      query,
      sector: selectedSector,
      status: selectedStatus,
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log("Input changed to:", newQuery);
    setQuery(newQuery);
    debouncedSearch({
      query: newQuery,
      sector: selectedSector,
      status: selectedStatus,
    });
  };

  const handleSectorChange = (value: string) => {
    console.log("Sector changed to:", value);
    const newSector = value === 'all' ? null : value as SectorEnum;
    setSelectedSector(newSector);
    debouncedSearch({
      query,
      sector: newSector,
      status: selectedStatus,
    });
  };

  const handleStatusChange = (value: string) => {
    console.log("Status changed to:", value);
    const newStatus = value === 'all' ? null : value as TenderStatus;
    setSelectedStatus(newStatus);
    debouncedSearch({
      query,
      sector: selectedSector,
      status: newStatus,
    });
  };

  return (
    <div className="space-y-4">
      <div className="sm:space-y-0 sm:grid sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="sm:col-span-2 md:col-span-4 mb-4 sm:mb-0">
          <Input
            type="text"
            placeholder="Enter search query"
            value={query}
            onChange={handleInputChange}
            className="w-full"
          />
        </div>
        
        <div className="sm:col-span-1 md:col-span-1 mb-4 sm:mb-0">
          <div className="relative" style={{ zIndex: 30 }}>
            <Select value={selectedSector || 'all'} onValueChange={handleSectorChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select sector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {Object.values(SectorEnum).map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="sm:col-span-1 md:col-span-1 mb-4 sm:mb-0">
          <div className="relative" style={{ zIndex: 20 }}>
            <Select value={selectedStatus || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {Object.values(TenderStatus).map((status) => (
                  <SelectItem key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="sm:col-span-2 md:col-span-2">
          <Button onClick={handleSearch} disabled={isLoading} className="w-full h-10">
            {isLoading ? (
              <div className="flex items-center justify-center">
                <ClipLoader color="#FFFFFF" size={20} />
                <span className="ml-2">Searching...</span>
              </div>
            ) : (
              'Search'
            )}
          </Button>
        </div>
      </div>

      {searchError && (
        <div className="text-red-500 mt-4">
          Error: {searchError}
        </div>
      )}
    </div>
  );
};

export default ComprehensiveTenderSearch;