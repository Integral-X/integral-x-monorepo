/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Build Consistency", () => {
  // Helper function to clear NX cache before critical tests
  const clearNxCache = () => {
    try {
      execSync("npx nx reset", { encoding: "utf8", timeout: 30000 });
    } catch (error) {
      console.warn("Failed to clear NX cache, continuing with test");
    }
  };

  // Helper function to execute build with retry logic
  const executeWithRetry = (
    command: string,
    maxRetries: number = 2,
  ): string => {
    let lastError: any;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return execSync(command, {
          encoding: "utf8",
          timeout: 120000, // 2 minutes timeout
        });
      } catch (error: any) {
        lastError = error;
        console.warn(
          `Build attempt ${attempt} failed, ${maxRetries - attempt} retries remaining`,
        );

        if (attempt < maxRetries) {
          // Wait a bit before retry
          execSync("sleep 1", { encoding: "utf8" });
        }
      }
    }

    throw new Error(
      `Build failed after ${maxRetries} attempts: ${lastError.message}\nFinal Output: ${lastError.stdout || "No stdout"}\nFinal Error: ${lastError.stderr || "No stderr"}`,
    );
  };

  it("should build all projects successfully with cache cleared", () => {
    // Clear cache to ensure clean build state
    clearNxCache();

    const result = executeWithRetry("npx nx run-many --target=build --all");

    // Check that the build was successful - look for success indicators and absence of errors
    expect(result).toContain("NX");
    expect(result).not.toContain("failed");
    expect(result).not.toContain("error");
    expect(result).not.toContain("Error");

    // Verify that all expected projects were built
    expect(result).toContain("@integral-x/messaging");
    expect(result).toContain("@integral-x/observability");
    expect(result).toContain("@integral-x/common");
    expect(result).toContain("auth");
    expect(result).toContain("api-gateway");
    expect(result).toContain("ebay-service");
  });

  it("should build individual services successfully", () => {
    const services = ["ebay-service", "api-gateway"];

    services.forEach((service) => {
      try {
        const result = execSync(`npx nx build ${service}`, {
          encoding: "utf8",
          timeout: 60000, // 1 minute timeout per service
        });

        // Check for successful build - look for success indicators and absence of errors
        expect(result).toContain("NX");
        expect(result).toContain(service);
        expect(result).not.toContain("failed");
        expect(result).not.toContain("error");
        expect(result).not.toContain("Error");
      } catch (error: any) {
        throw new Error(
          `Build failed for ${service}: ${error.message}\nOutput: ${error.stdout || "No stdout"}\nError: ${error.stderr || "No stderr"}`,
        );
      }
    });
  });

  it("should build shared libraries successfully", () => {
    const libraries = [
      "@integral-x/messaging",
      "@integral-x/observability",
      "@integral-x/common",
      "auth",
    ];

    libraries.forEach((library) => {
      try {
        const result = execSync(`npx nx build ${library}`, {
          encoding: "utf8",
          timeout: 60000, // 1 minute timeout per library
        });

        // Check for successful build - look for success indicators and absence of errors
        expect(result).toContain("NX");
        expect(result).toContain(library);
        expect(result).not.toContain("failed");
        expect(result).not.toContain("error");
        expect(result).not.toContain("Error");
      } catch (error: any) {
        throw new Error(`Build failed for ${library}: ${error.message}`);
      }
    });
  });

  it("should have consistent TypeScript configuration", () => {
    // Check that all apps have proper path mappings
    const apps = ["ebay-service", "api-gateway"];

    apps.forEach((app) => {
      const tsconfigPath = path.join("apps", app, "tsconfig.json");
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

      // Verify path mappings exist
      const baseTsconfigPath = path.join("tsconfig.base.json");
      const baseTsconfig = JSON.parse(
        fs.readFileSync(baseTsconfigPath, "utf8"),
      );
      const paths =
        tsconfig.compilerOptions.paths || baseTsconfig.compilerOptions.paths;
      expect(paths).toBeDefined();
      expect(paths["@integral-x/messaging"]).toBeDefined();
      expect(paths["@integral-x/observability"]).toBeDefined();
      expect(paths["@integral-x/common"]).toBeDefined();
      expect(paths["@integral-x/auth"]).toBeDefined();
    });
  });
});
