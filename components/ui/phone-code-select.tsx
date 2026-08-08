"use client";

import { useMemo, useState } from "react";
import { Country } from "country-state-city";
import { SearchableSelect, type SearchableOption } from "@/components/ui/searchable-select";
import { countryCodes } from "@/lib/country-codes";

interface PhoneCodeSelectProps {
  defaultValue?: string;
  name?: string;
  /** For controlled usage (e.g. checkout) */
  value?: string;
  onValueChange?: (val: string) => void;
  className?: string;
  disabled?: boolean;
}

/** Map of phone code → flag emoji (first matching country) */
const codeToFlag = (() => {
  const map = new Map<string, string>();
  Country.getAllCountries().forEach((c) => {
    if (!c.phonecode || !c.flag) return;
    const code = `+${c.phonecode.replace(/\D/g, "")}`;
    if (!map.has(code)) map.set(code, c.flag);
  });
  return map;
})();

/**
 * Searchable phone country code selector.
 * Trigger shows only "+44", dropdown shows "🇬🇧 +44" on one line.
 */
export function PhoneCodeSelect({
  defaultValue = "+44",
  name,
  value: controlledValue,
  onValueChange,
  className = "h-10 sm:h-12",
  disabled,
}: PhoneCodeSelectProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const isControlled = controlledValue !== undefined;
  const selected = isControlled ? controlledValue : internalValue;

  function handleChange(val: string) {
    if (!isControlled) setInternalValue(val);
    onValueChange?.(val);
  }

  const options = useMemo(
    () =>
      countryCodes.map((c) => ({
        value: c.code,
        label: c.code,          // used by cmdk for search filtering
        shortLabel: c.code,     // shown in trigger
        flag: codeToFlag.get(c.code) ?? "",
      })),
    []
  );

  return (
    <>
      {name && <input type="hidden" name={name} value={selected} />}
      <SearchableSelect
        options={options}
        value={selected}
        onValueChange={handleChange}
        placeholder="+44"
        searchPlaceholder="Search code..."
        emptyText="No code found."
        disabled={disabled}
        className={className}
        popoverMinWidth="140px"
        renderOption={(opt) => {
          const o = opt as SearchableOption & { flag: string };
          return (
            <span className="flex items-center gap-2 whitespace-nowrap">
              {o.flag && <span>{o.flag}</span>}
              <span>{o.label}</span>
            </span>
          );
        }}
      />
    </>
  );
}
