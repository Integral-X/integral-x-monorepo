/*
 * Copyright (c) 2025 Integral-X or Integral-X affiliate company. All rights reserved.
 */
export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface RequestWithUser extends Request {
  user?: User;
  correlationId?: string;
}
