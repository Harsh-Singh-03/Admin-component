"use client"

import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

interface ComboboxProps {
  data: { [key: string]: any }[] // Array of data items, each being an object
  labelKey: string               // The key to use as a label in the data items
  valueKey: string               // The key to use as a value in the data items
  placeholder?: string           // Placeholder for the trigger button
  triggerText?: string    
  content_class?: string       // Text to show when items are selected
  value: string[]    
  disabled?: boolean            // Current selected values for the combobox
  onValueChange: (values: string[]) => void // Handler for when values change
}

export function Combobox({
  data,
  labelKey,
  valueKey,
  placeholder = "Select items...",
  triggerText = "selected",
  value,
  content_class,
  onValueChange,
  disabled,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)

  // Handles the selection/deselection of an item
  const handleSelect = (currentValue: string) => {
    const newValue = value.includes(currentValue)
      ? value.filter((val) => val !== currentValue) // Deselect if already selected
      : [...value, currentValue]                    // Select if not already selected

    onValueChange(newValue)
  }

  return (
    <div className="space-y-2">
      {/* Display selected items as badges */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((val) => {
            const item = data.find((item) => item[valueKey] === val)
            const label = item ? item[labelKey] : ""
            return (
              <Badge key={val} variant="secondary" className="flex items-center space-x-1 cursor-pointer hover:-translate-y-1 transition-all duration-200">
                <span>{label}</span>
                <X
                  className="cursor-pointer"
                  size={14}
                  onClick={() => handleSelect(val)}
                />
              </Badge>
            )
          })}
        </div>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild disabled={disabled || false}>
          <Button
            variant="outline"
            role="combobox"
            disabled={disabled || false}
            aria-expanded={open}
            className="w-full justify-between hover:bg-secondary/30"
          >
            {value.length > 0
              ? `${value.length} ${triggerText}`
              : placeholder}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className={cn("p-0 min-w-full", content_class && content_class)}>
          <Command>
            <CommandInput placeholder={`Search ${placeholder.toLowerCase()}...`} />
            <CommandList>
              <CommandEmpty>No items found.</CommandEmpty>
              <CommandGroup>
                {data.map((item) => (
                  <CommandItem
                    key={item[valueKey]}
                    value={item[labelKey]}
                    onSelect={() => handleSelect(item[valueKey])}
                  >
                    {item[labelKey]}
                    <Check
                      className={cn(
                        "ml-auto",
                        value.includes(item[valueKey]) ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
