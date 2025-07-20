/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
// This is a mock for class-validator to allow decorators to be applied without errors in tests.
// It does not implement actual validation logic.

export function IsString(): PropertyDecorator {
  return () => {};
}
export function IsNotEmpty(): PropertyDecorator {
  return () => {};
}
export function IsNumber(): PropertyDecorator {
  return () => {};
}
export function IsOptional(): PropertyDecorator {
  return () => {};
}
export function ValidateNested(): PropertyDecorator {
  return () => {};
}
export function IsArray(): PropertyDecorator {
  return () => {};
}
export function ArrayMinSize(): PropertyDecorator {
  return () => {};
}
export function ArrayMaxSize(): PropertyDecorator {
  return () => {};
}
export function Min(): PropertyDecorator {
  return () => {};
}
export function Max(): PropertyDecorator {
  return () => {};
}
export function MinLength(): PropertyDecorator {
  return () => {};
}
export function MaxLength(): PropertyDecorator {
  return () => {};
}
export function IsEnum(): PropertyDecorator {
  return () => {};
}
export function IsBoolean(): PropertyDecorator {
  return () => {};
}
export function IsDate(): PropertyDecorator {
  return () => {};
}
export function IsUUID(): PropertyDecorator {
  return () => {};
}
export function IsUrl(): PropertyDecorator {
  return () => {};
}

export function registerDecorator(): void {}
export function ValidationOptions(): PropertyDecorator {
  return () => {};
}
export function ValidatorConstraint(): ClassDecorator {
  return () => {};
}
export function ValidatorConstraintInterface(): ClassDecorator {
  return () => {};
}
