/**
 * Copyright (C) 2026 Roberto Díaz. All rights reserved.
 * Licensed under the GNU General Public License v3.0. See LICENSE for details.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { themeService } from "../../services/themeService";
import themeFallback from "../../config/theme-fallback.json";

describe("themeService", () => {
  let setPropertySpy: any;
  let originalLocation: Location;

  beforeEach(() => {
    // Spy on document.documentElement.style.setProperty
    setPropertySpy = vi.spyOn(document.documentElement.style, "setProperty");
    
    // Save original location
    originalLocation = window.location;

    // Suppress console info/logs during tests to keep output clean
    vi.spyOn(console, "log").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
    // Restore window.location
    Object.defineProperty(window, "location", {
      value: originalLocation,
      writable: true,
    });
  });

  it("should apply fallback theme when protocol is unsupported (e.g. file:)", async () => {
    // Mock location with file: protocol
    Object.defineProperty(window, "location", {
      value: {
        protocol: "file:",
        origin: "file://",
      },
      writable: true,
    });

    const fetchSpy = vi.spyOn(globalThis, "fetch");

    await themeService.initializeTheme();

    // Fetch should not have been called
    expect(fetchSpy).not.toHaveBeenCalled();

    // Fallback styles should have been applied
    Object.entries(themeFallback).forEach(([variable, value]) => {
      expect(setPropertySpy).toHaveBeenCalledWith(variable, value);
    });
  });

  it("should apply fallback theme when fetch fails (e.g. 404 or network error)", async () => {
    // Mock location with http: protocol
    Object.defineProperty(window, "location", {
      value: {
        protocol: "http:",
        origin: "http://localhost:5174",
      },
      writable: true,
    });

    // Mock fetch to return not ok
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await themeService.initializeTheme();

    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:5174/theme-custom.json");

    // Fallback styles should still be applied
    Object.entries(themeFallback).forEach(([variable, value]) => {
      expect(setPropertySpy).toHaveBeenCalledWith(variable, value);
    });
  });

  it("should merge and apply custom overrides when fetch succeeds", async () => {
    // Mock location with http: protocol
    Object.defineProperty(window, "location", {
      value: {
        protocol: "https:",
        origin: "https://cartai.app",
      },
      writable: true,
    });

    const customOverrides = {
      "--color-brand-primary": "#ff0000", // Override existing
      "--color-custom-extra": "#00ff00",  // New custom variable
    };

    // Mock fetch to return ok with JSON
    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => customOverrides,
    } as Response);

    await themeService.initializeTheme();

    expect(fetchSpy).toHaveBeenCalledWith("https://cartai.app/theme-custom.json");

    // Fallback should be overridden for primary
    expect(setPropertySpy).toHaveBeenCalledWith("--color-brand-primary", "#ff0000");

    // New custom variable should be set
    expect(setPropertySpy).toHaveBeenCalledWith("--color-custom-extra", "#00ff00");

    // Unmodified fallbacks should still be set to original values
    expect(setPropertySpy).toHaveBeenCalledWith("--color-brand-accent", themeFallback["--color-brand-accent"]);
  });
});
