import * as React from "react";
import { Check, ChevronDownIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useFormField } from "./FormField";
import { cn } from "@/lib/utils";
import type { SelectOption, SelectOptionGroup } from "./FormSelect";

interface FormComboboxProps {
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  options?: SelectOption[];
  groups?: SelectOptionGroup[];
  className?: string;
  disabled?: boolean;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const FormCombobox = React.forwardRef<
  HTMLButtonElement,
  FormComboboxProps
>(
  (
    {
      placeholder = "Selecciona una opción",
      searchPlaceholder = "Buscar...",
      emptyMessage = "Sin resultados.",
      options = [],
      groups = [],
      className,
      disabled,
      value,
      onValueChange,
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const { error, formItemId, formDescriptionId, formMessageId } =
      useFormField();

    const hasGroups = groups.length > 0;

    const selectedLabel = React.useMemo(() => {
      if (!value) return null;
      if (hasGroups) {
        return groups.flatMap((g) => g.options).find((o) => o.value === value)
          ?.label;
      }
      return options.find((o) => o.value === value)?.label;
    }, [value, options, groups, hasGroups]);

    const handleSelect = (selectedValue: string) => {
      onValueChange?.(selectedValue === value ? "" : selectedValue);
      setOpen(false);
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          ref={ref}
          id={formItemId}
          aria-describedby={
            !error ? formDescriptionId : `${formDescriptionId} ${formMessageId}`
          }
          aria-invalid={!!error}
          disabled={disabled}
          role="combobox"
          aria-expanded={open}
          className={cn(
            "bg-[#F9FAFB] border-[#F3F4F6] [&_svg:not([class*='text-'])]:text-[#9CA3AF] focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-input dark:bg-input/30 dark:border-input dark:hover:bg-input/50 flex h-12 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap shadow-sm dark:shadow-none transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
            !selectedLabel && "text-[#9CA3AF] dark:text-white/80",
            selectedLabel && "dark:text-white/80",
            error && "aria-invalid:border-destructive",
            className,
          )}
        >
          <span className="truncate">{selectedLabel ?? placeholder}</span>
          <ChevronDownIcon className="size-4 opacity-50 pointer-events-none shrink-0" />
        </PopoverTrigger>

        <PopoverContent
          className="w-[var(--radix-popover-trigger-width)] p-0"
          align="start"
        >
          <Command>
            <CommandInput placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>

              {hasGroups ? (
                groups.map((group) => (
                  <CommandGroup key={group.label} heading={group.label}>
                    {group.options.map((option) => (
                      <CommandItem
                        key={option.value}
                        value={option.label}
                        disabled={option.disabled}
                        onSelect={() => handleSelect(option.value)}
                      >
                        {option.label}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            value === option.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))
              ) : (
                <CommandGroup>
                  {options.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.label}
                      disabled={option.disabled}
                      onSelect={() => handleSelect(option.value)}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          "ml-auto h-4 w-4",
                          value === option.value ? "opacity-100" : "opacity-0",
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  },
);

FormCombobox.displayName = "FormCombobox";
