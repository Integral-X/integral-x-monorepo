/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import * as fs from "fs";
import { execSync } from "child_process";

describe("Import Path Validation", () => {
  it("should not use direct relative imports to shared libraries", () => {
    // Find all TypeScript files in apps directory
    const appFiles = execSync(
      'find apps -name "*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -name "*.d.ts"',
      { encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);

    const invalidImports: Array<{
      file: string;
      line: number;
      content: string;
    }> = [];

    appFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf8");
      const lines = content.split("\n");

      lines.forEach((line, index) => {
        // Check for relative imports to libs directory
        const relativeLibImportRegex = /from\s+['"](\.\.\/)+libs\//;
        if (relativeLibImportRegex.test(line)) {
          invalidImports.push({
            file: filePath,
            line: index + 1,
            content: line.trim(),
          });
        }
      });
    });

    if (invalidImports.length > 0) {
      const errorMessage = invalidImports
        .map((imp) => `${imp.file}:${imp.line} - ${imp.content}`)
        .join("\n");

      throw new Error(
        `Found ${invalidImports.length} invalid relative imports to shared libraries. ` +
          `Use @integral-x/* path mappings instead:\n${errorMessage}`,
      );
    }
  });

  it("should use consistent @integral-x/* imports for shared libraries", () => {
    const appFiles = execSync(
      'find apps -name "*.ts" -not -path "*/node_modules/*" -not -path "*/dist/*" -not -name "*.d.ts"',
      { encoding: "utf8" },
    )
      .trim()
      .split("\n")
      .filter(Boolean);

    const validPathMappings = [
      "@integral-x/auth",
      "@integral-x/common",
      "@integral-x/messaging",
      "@integral-x/observability",
    ];

    let hasValidImports = false;

    appFiles.forEach((filePath) => {
      const content = fs.readFileSync(filePath, "utf8");

      validPathMappings.forEach((mapping) => {
        if (content.includes(`from "${mapping}"`)) {
          hasValidImports = true;
        }
      });
    });

    // This test passes if we find at least some valid path mapping imports
    expect(hasValidImports).toBe(true);
  });
});
