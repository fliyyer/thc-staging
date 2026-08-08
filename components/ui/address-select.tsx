"use client";

import { useState, useEffect, useMemo } from "react";
import { Country, State, City } from "country-state-city";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SearchableSelect } from "@/components/ui/searchable-select";

interface AddressSelectProps {
  countryName?: string;
  stateName?: string;
  cityName?: string;
  defaultCountryCode?: string;
  defaultStateCode?: string;
  defaultCity?: string;
  disabled?: boolean;
  /** Called when country changes — useful to sync phone code etc. */
  onCountryChange?: (isoCode: string) => void;
  /** Label / trigger size variant */
  size?: "sm" | "default";
}

/**
 * Cascading Country → State/Province → City searchable dropdowns.
 * Uses the `country-state-city` static library — no API key required.
 * Automatically falls back to text inputs if a country/state has no database records.
 */
export function AddressSelect({
  countryName = "country",
  stateName = "state",
  cityName = "city",
  defaultCountryCode = "GB",
  defaultStateCode = "",
  defaultCity = "",
  disabled = false,
  onCountryChange,
  size = "default",
}: AddressSelectProps) {
  // Resolve country ISO code if a name was passed (e.g. "United Kingdom" -> "GB")
  const resolvedCountryCode = useMemo(() => {
    if (!defaultCountryCode) return "GB";
    if (defaultCountryCode.length === 2) return defaultCountryCode.toUpperCase();
    const found = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === defaultCountryCode.toLowerCase()
    );
    return found ? found.isoCode : "GB";
  }, [defaultCountryCode]);

  // Resolve state ISO code if a name was passed (e.g. "England" -> "ENG")
  const resolvedStateCode = useMemo(() => {
    if (!defaultStateCode) return "";
    if (defaultStateCode.length <= 3) return defaultStateCode.toUpperCase();
    const found = State.getStatesOfCountry(resolvedCountryCode).find(
      (s) => s.name.toLowerCase() === defaultStateCode.toLowerCase()
    );
    return found ? found.isoCode : defaultStateCode;
  }, [defaultStateCode, resolvedCountryCode]);

  const [countryCode, setCountryCode] = useState(resolvedCountryCode);
  const [stateCode, setStateCode] = useState(resolvedStateCode);
  const [city, setCity] = useState(defaultCity);

  // Sync state when props change
  useEffect(() => {
    setCountryCode(resolvedCountryCode);
  }, [resolvedCountryCode]);

  useEffect(() => {
    setStateCode(resolvedStateCode);
  }, [resolvedStateCode]);

  useEffect(() => {
    setCity(defaultCity);
  }, [defaultCity]);

  const labelClass =
    size === "sm" ? "text-xs sm:text-sm font-semibold" : "font-semibold";

  const triggerClass =
    size === "sm" ? "h-10 sm:h-12 text-xs sm:text-sm" : "h-12 text-sm";

  // Build options lists (memoised for perf)
  const countryOptions = useMemo(
    () =>
      Country.getAllCountries().map((c) => ({
        value: c.isoCode,
        label: `${c.flag} ${c.name}`,
      })),
    []
  );

  const stateOptions = useMemo(
    () =>
      State.getStatesOfCountry(countryCode).map((s) => ({
        value: s.isoCode,
        label: s.name,
      })),
    [countryCode]
  );

  const cityOptions = useMemo(
    () =>
      City.getCitiesOfState(countryCode, stateCode).map((c) => ({
        value: c.name,
        label: c.name,
      })),
    [countryCode, stateCode]
  );

  // Reset children when country changes
  const handleCountryChange = (newCountryCode: string) => {
    setCountryCode(newCountryCode);
    setStateCode("");
    setCity("");
    onCountryChange?.(newCountryCode);
  };

  // Reset city when state changes
  const handleStateChange = (newStateCode: string) => {
    setStateCode(newStateCode);
    setCity("");
  };

  const selectedCountry = useMemo(() => {
    return Country.getCountryByCode(countryCode);
  }, [countryCode]);

  const selectedState = useMemo(() => {
    return State.getStateByCodeAndCountry(stateCode, countryCode);
  }, [stateCode, countryCode]);

  const hasStates = stateOptions.length > 0;
  const hasCities = cityOptions.length > 0;

  const showManualState = !hasStates;
  const showManualCity = !hasStates || (hasStates && stateCode !== "" && !hasCities);

  const isCityDisabled = disabled || (hasStates && !stateCode);

  return (
    <>
      {/* Hidden country input */}
      <input type="hidden" name={countryName} value={selectedCountry?.name || countryCode} />

      {/* Hidden state input (only if state is selected from list) */}
      {!showManualState && (
        <input type="hidden" name={stateName} value={selectedState?.name || stateCode} />
      )}

      {/* Hidden city input (only if city is selected from list) */}
      {!showManualCity && (
        <input type="hidden" name={cityName} value={city} />
      )}

      {/* Country Selector */}
      <div>
        <Label className={labelClass}>
          Country / Region<span className="text-red-600">*</span>
        </Label>
        <div className="mt-2 sm:mt-3">
          <SearchableSelect
            options={countryOptions}
            value={countryCode}
            onValueChange={handleCountryChange}
            placeholder="Select Country"
            searchPlaceholder="Search country..."
            emptyText="No country found."
            disabled={disabled}
            className={triggerClass}
          />
        </div>
      </div>

      {/* State / Province Selector / Manual Input */}
      <div>
        <Label className={labelClass}>
          State / Province<span className="text-red-600">*</span>
        </Label>
        <div className="mt-2 sm:mt-3">
          {showManualState ? (
            <Input
              name={stateName}
              value={stateCode}
              onChange={(e) => setStateCode(e.target.value)}
              disabled={disabled}
              required
              placeholder="Enter State / Province"
              className={triggerClass}
            />
          ) : (
            <SearchableSelect
              options={stateOptions}
              value={stateCode}
              onValueChange={handleStateChange}
              placeholder="Select State / Province"
              searchPlaceholder="Search state..."
              emptyText="No state found."
              disabled={disabled}
              className={triggerClass}
            />
          )}
        </div>
      </div>

      {/* Town / City Selector / Manual Input */}
      <div>
        <Label className={labelClass}>
          Town / City<span className="text-red-600">*</span>
        </Label>
        <div className="mt-2 sm:mt-3">
          {showManualCity ? (
            <Input
              name={cityName}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              disabled={isCityDisabled}
              required
              placeholder={
                hasStates && !stateCode
                  ? "Select a state first"
                  : "Enter Town / City"
              }
              className={triggerClass}
            />
          ) : (
            <SearchableSelect
              options={cityOptions}
              value={city}
              onValueChange={setCity}
              placeholder={
                !stateCode
                  ? "Select a state first"
                  : "Select City"
              }
              searchPlaceholder="Search city..."
              emptyText="No city found."
              disabled={isCityDisabled}
              className={triggerClass}
            />
          )}
        </div>
      </div>
    </>
  );
}
