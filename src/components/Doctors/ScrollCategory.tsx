// app/doctors/components/ScrollCategory.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

interface ScrollCategoryProps {
  specialties: string;
  onSpecialtyChange: (specialty: string) => void;
  isLoading: boolean;
  specialtiesList: any[];
}

const ScrollCategory = ({ 
  specialties, 
  onSpecialtyChange, 
  isLoading, 
  specialtiesList 
}: ScrollCategoryProps) => {
  return (
    <div className="mb-6">
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-2 pb-4">
          <Button
            variant={!specialties ? "default" : "outline"}
            size="sm"
            onClick={() => onSpecialtyChange("")}
            className="flex-shrink-0"
          >
            All Specialties
          </Button>
          
          {isLoading ? (
            // Loading skeletons
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 flex-shrink-0 rounded-md" />
            ))
          ) : (
            specialtiesList.map((specialty) => (
              <Button
                key={specialty.id}
                variant={specialties === specialty.title ? "default" : "outline"}
                size="sm"
                onClick={() => onSpecialtyChange(specialty.title)}
                className="flex-shrink-0"
              >
                {specialty.title}
              </Button>
            )) 
          )}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};

export default ScrollCategory;