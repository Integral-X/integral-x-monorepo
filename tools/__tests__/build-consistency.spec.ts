/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

describe("Build Consistency", () => {
  it("should build all projects successfully", () => {
    try {
      const result = execSync("npx nx run-many --target=build --all", {
        encoding: "utf8",
        timeout: 120000, // 2 minutes timeout
      });

      // Check that the build was successful - look for success indicators and absence of errors
      expect(result).toContain("NX");
      expect(result).not.toContain("failed");
      expect(result).not.toContain("error");
      expect(result).not.toContain("Error");
    } catch (error: any) {
      throw new Error(
        `Build failed: ${error.message}\nOutput: ${error.stdout}\nError: ${error.stderr}`,
      );
    }
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
        throw new Error(`Build failed for ${service}: ${error.message}`);
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
      expect(tsconfig.compilerOptions.paths).toBeDefined();
      expect(
        tsconfig.compilerOptions.paths["@integral-x/messaging"],
      ).toBeDefined();
      expect(
        tsconfig.compilerOptions.paths["@integral-x/observability"],
      ).toBeDefined();
      expect(
        tsconfig.compilerOptions.paths["@integral-x/common"],
      ).toBeDefined();
      expect(tsconfig.compilerOptions.paths["@integral-x/auth"]).toBeDefined();
    });
  });
});
