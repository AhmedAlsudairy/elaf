import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/shadcn/utils";

export interface MultiSelectOption {
  id: string;
  name: string;
}

interface MultiSelectProps {
  options: MultiSelectOption[];
  selected: string[] | undefined;
  onChange: (selected: string[]) => void;
  placeholder: string;
  className?: string;
  disabled?: boolean;
}

const MultiSelect: React.FC<MultiSelectProps> = ({
  options,
  selected = [],
  onChange,
  placeholder,
  className,
  disabled = false,
  ...props
}) => {
  const [open, setOpen] = React.useState(false);

  const handleUnselect = (item: string) => {
    if (!disabled) {
      onChange(selected.filter((i) => i !== item));
    }
  };

  const handleSelect = (id: string) => {
    if (!disabled) {
      const newSelectedValues = selected.includes(id)
        ? selected.filter((item) => item !== id)
        : [...selected, id];
      onChange(newSelectedValues);
    }
  };

  return (
    <Popover open={open && !disabled} onOpenChange={setOpen} {...props}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between h-auto", className, {
            "opacity-50 cursor-not-allowed": disabled,
          })}
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
        >
          <div className="flex gap-1 flex-wrap">
            {selected.length > 0 ? (
              selected.map((item) => (
                <Badge
                  variant="default"
                  key={item}
                  className={cn("mr-1 mb-1 bg-primary text-primary-foreground hover:bg-primary/90", {
                    "opacity-50": disabled,
                  })}
                >
                  {options.find((option) => item === option.id)?.name}
                  <button
                    type="button"
                    className={cn("ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
                      "cursor-not-allowed": disabled,
                    })}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !disabled) {
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={() => handleUnselect(item)}
                    disabled={disabled}
                  >
                    <X className="h-3 w-3 text-white hover:text-foreground" />
                  </button>
                </Badge>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search ..." />
          <CommandEmpty>No item found.</CommandEmpty>
          <CommandList>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => (
                <CommandItem
                  key={option.id}
                  onSelect={() => handleSelect(option.id)}
                  disabled={disabled}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selected.includes(option.id) ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export { MultiSelect };