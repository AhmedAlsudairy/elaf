import * as React from "react";
import { Check, X, ChevronsUpDown } from "lucide-react";
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
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            "flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer",
            className,
            {
              "opacity-50 cursor-not-allowed": disabled,
            }
          )}
          onClick={() => !disabled && setOpen(!open)}
          tabIndex={disabled ? -1 : 0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!disabled) setOpen(!open);
            }
          }}
        >
          <div className="flex gap-1 flex-wrap flex-1">
            {selected.length > 0 ? (
              selected.map((item) => (
                <span
                  key={item}
                  className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-md bg-primary text-primary-foreground text-sm mr-1 mb-1", {
                    "opacity-50": disabled,
                  })}
                >
                  {options.find((option) => item === option.id)?.name}
                  <span
                    role="button"
                    tabIndex={disabled ? -1 : 0}
                    className={cn("p-0 h-4 w-4 rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 focus:ring-offset-background hover:bg-white/20 inline-flex items-center justify-center", {
                      "cursor-not-allowed": disabled,
                      "cursor-pointer": !disabled,
                    })}
                    onKeyDown={(e) => {
                      if ((e.key === "Enter" || e.key === " ") && !disabled) {
                        e.preventDefault();
                        e.stopPropagation();
                        handleUnselect(item);
                      }
                    }}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleUnselect(item);
                    }}
                    aria-label={`Remove ${options.find((option) => item === option.id)?.name}`}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </span>
              ))
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </div>
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