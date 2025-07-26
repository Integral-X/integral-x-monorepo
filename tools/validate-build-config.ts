/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

interface ProjectConfig {
  name: string;
  sourceRoot: string;
  projectType: "application" | "library";
  targets?: {
    build?: {
      executor: string;
      outputs: string[];
      options: {
        outputPath: string;
        main: string;
        tsConfig: string;
      };
    };
  };
  implicitDependencies?: string[];
}

interface TSConfig {
  extends?: string;
  compilerOptions?: {
    paths?: Record<string, string[]>;
    outDir?: string;
    declaration?: boolean;
  };
}

class BuildValidator {
  private workspaceRoot: string;
  private errors: string[] = [];
  private warnings: string[] = [];

  constructor() {
    this.workspaceRoot = process.cwd();
  }

  async validate(): Promise<void> {
    console.log("🔍 Starting build configuration validation...\n");

    await this.validateProjectConfigurations();
    await this.validateTypeScriptConfigurations();
    await this.validateBuildOutputStructure();
    await this.validateDependencyGraph();

    this.printResults();
  }

  private async validateProjectConfigurations(): Promise<void> {
    console.log("📋 Validating project configurations...");

    const nxConfig = this.readJsonFile("nx.json");
    const projects = nxConfig.projects || {};

    for (const [projectName, projectPath] of Object.entries(projects)) {
      const projectJsonPath = path.join(projectPath as string, "project.json");

      if (!fs.existsSync(projectJsonPath)) {
        this.errors.push(`Missing project.json for project: ${projectName}`);
        continue;
      }

      const projectConfig: ProjectConfig = this.readJsonFile(projectJsonPath);

      // Validate project name consistency
      if (projectConfig.name !== projectName) {
        this.errors.push(
          `Project name mismatch: nx.json has "${projectName}" but project.json has "${projectConfig.name}"`,
        );
      }

      // Validate build target for libraries and applications (skip e2e test projects)
      if (
        (projectConfig.projectType === "library" ||
          projectConfig.projectType === "application") &&
        !projectName.includes("-e2e")
      ) {
        if (!projectConfig.targets?.build) {
          this.errors.push(`Missing build target for project: ${projectName}`);
        } else {
          const buildTarget = projectConfig.targets.build;

          // Validate executor consistency
          if (buildTarget.executor !== "@nx/js:tsc") {
            this.warnings.push(
              `Project ${projectName} uses executor "${buildTarget.executor}" instead of "@nx/js:tsc"`,
            );
          }

          // Validate output path structure
          const expectedOutputPath = `${projectPath}/dist`;
          if (buildTarget.options.outputPath !== expectedOutputPath) {
            this.warnings.push(
              `Project ${projectName} output path "${buildTarget.options.outputPath}" doesn't match expected "${expectedOutputPath}"`,
            );
          }
        }
      }
    }

    console.log("✅ Project configuration validation complete\n");
  }

  private async validateTypeScriptConfigurations(): Promise<void> {
    console.log("📝 Validating TypeScript configurations...");

    const baseTsConfig: TSConfig = this.readJsonFile("tsconfig.base.json");
    const basePaths = baseTsConfig.compilerOptions?.paths || {};

    const nxConfig = this.readJsonFile("nx.json");
    const projects = nxConfig.projects || {};

    for (const [projectName, projectPath] of Object.entries(projects)) {
      const tsconfigPath = path.join(projectPath as string, "tsconfig.json");

      if (!fs.existsSync(tsconfigPath)) {
        this.errors.push(`Missing tsconfig.json for project: ${projectName}`);
        continue;
      }

      const tsconfig: TSConfig = this.readJsonFile(tsconfigPath);

      // Validate extends base config
      if (
        !tsconfig.extends ||
        !tsconfig.extends.includes("tsconfig.base.json")
      ) {
        this.errors.push(
          `Project ${projectName} tsconfig.json doesn't extend tsconfig.base.json`,
        );
      }

      // Validate path mappings consistency
      const projectPaths = tsconfig.compilerOptions?.paths || {};

      // Projects inherit paths from tsconfig.base.json. This check validates that if a project
      // *overrides* a path, it does so correctly. It no longer throws an error if the path is not present.
      for (const [alias, mappedPaths] of Object.entries(projectPaths)) {
        if (basePaths[alias]) {
          const expectedPath = this.getRelativePathMapping(
            projectPath as string,
            basePaths[alias][0],
          );
          if (mappedPaths[0] !== expectedPath) {
            this.warnings.push(
              `Project ${projectName} path mapping for ${alias} is "${mappedPaths[0]}" but expected "${expectedPath}"`,
            );
          }
        }
      }

      // Validate declaration generation for libraries
      if ((projectPath as string).startsWith("libs/")) {
        if (!tsconfig.compilerOptions?.declaration) {
          this.errors.push(
            `Library ${projectName} should have declaration: true in tsconfig.json`,
          );
        }
      }
    }

    console.log("✅ TypeScript configuration validation complete\n");
  }

  private async validateBuildOutputStructure(): Promise<void> {
    console.log("🏗️  Validating build output structure...");

    const nxConfig = this.readJsonFile("nx.json");
    const projects = nxConfig.projects || {};

    for (const [projectName, projectPath] of Object.entries(projects)) {
      const projectJsonPath = path.join(projectPath as string, "project.json");

      if (!fs.existsSync(projectJsonPath)) continue;

      const projectConfig: ProjectConfig = this.readJsonFile(projectJsonPath);

      if (projectConfig.targets?.build) {
        const outputPath = projectConfig.targets.build.options.outputPath;
        const distPath = path.resolve(outputPath);

        // Check if build output exists (only if project has been built)
        if (fs.existsSync(distPath)) {
          // Validate main entry point exists
          const mainFile = projectConfig.targets.build.options.main;
          const mainFileName = path.basename(mainFile, ".ts") + ".js";
          const expectedMainPath = path.join(distPath, "src", mainFileName);

          if (!fs.existsSync(expectedMainPath)) {
            this.warnings.push(
              `Project ${projectName} built output missing expected main file: ${expectedMainPath}`,
            );
          }

          // Validate declaration files for libraries
          if (projectConfig.projectType === "library") {
            const declarationFile = path.join(
              distPath,
              "src",
              path.basename(mainFile, ".ts") + ".d.ts",
            );
            if (!fs.existsSync(declarationFile)) {
              this.warnings.push(
                `Library ${projectName} missing declaration file: ${declarationFile}`,
              );
            }
          }

          // Validate package.json in dist for libraries
          if (projectConfig.projectType === "library") {
            const distPackageJson = path.join(distPath, "package.json");
            if (fs.existsSync(distPackageJson)) {
              const packageConfig = this.readJsonFile(distPackageJson);
              const expectedMain =
                "dist/src/" + path.basename(mainFile, ".ts") + ".js";
              const expectedTypes =
                "dist/src/" + path.basename(mainFile, ".ts") + ".d.ts";

              if (packageConfig.main !== expectedMain) {
                this.warnings.push(
                  `Library ${projectName} package.json main field is "${packageConfig.main}" but expected "${expectedMain}"`,
                );
              }

              if (packageConfig.types !== expectedTypes) {
                this.warnings.push(
                  `Library ${projectName} package.json types field is "${packageConfig.types}" but expected "${expectedTypes}"`,
                );
              }
            }
          }
        }
      }
    }

    console.log("✅ Build output structure validation complete\n");
  }

  private async validateDependencyGraph(): Promise<void> {
    console.log("🔗 Validating dependency graph...");

    try {
      // Test that NX can build the dependency graph
      execSync("npx nx graph --file=/tmp/nx-graph.json", {
        encoding: "utf8",
        stdio: "pipe",
        timeout: 30000,
      });

      console.log("✅ Dependency graph validation complete\n");
    } catch (error: any) {
      this.errors.push(`Failed to generate dependency graph: ${error.message}`);
    }
  }

  private getRelativePathMapping(
    projectPath: string,
    basePath: string,
  ): string {
    const projectDepth = projectPath.split("/").length;
    const prefix = "../".repeat(projectDepth);
    return prefix + basePath;
  }

  private readJsonFile(filePath: string): any {
    try {
      const content = fs.readFileSync(filePath, "utf8");
      return JSON.parse(content);
    } catch (error) {
      throw new Error(`Failed to read ${filePath}: ${error}`);
    }
  }

  private printResults(): void {
    console.log("📊 Validation Results:");
    console.log("=".repeat(50));

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(
        "🎉 All validations passed! Build configuration is consistent.",
      );
      process.exit(0);
    }

    if (this.errors.length > 0) {
      console.log(`❌ ${this.errors.length} Error(s):`);
      this.errors.forEach((error, index) => {
        console.log(`  ${index + 1}. ${error}`);
      });
      console.log();
    }

    if (this.warnings.length > 0) {
      console.log(`⚠️  ${this.warnings.length} Warning(s):`);
      this.warnings.forEach((warning, index) => {
        console.log(`  ${index + 1}. ${warning}`);
      });
      console.log();
    }

    if (this.errors.length > 0) {
      console.log("❌ Validation failed. Please fix the errors above.");
      process.exit(1);
    } else {
      console.log(
        "✅ Validation completed with warnings. Consider addressing them for better consistency.",
      );
      process.exit(0);
    }
  }
}

// Run validation if this script is executed directly
if (require.main === module) {
  const validator = new BuildValidator();
  validator.validate().catch((error) => {
    console.error("❌ Validation failed with error:", error);
    process.exit(1);
  });
}

export { BuildValidator };
