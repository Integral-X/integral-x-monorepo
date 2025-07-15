export interface User {
  id: string;
  email: string;
  roles: string[];
}

export interface RequestWithUser extends Request {
  user?: User;
  correlationId?: string;
} 