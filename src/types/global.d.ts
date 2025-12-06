declare namespace Express {
  interface UserPayload {
    id: number;
    name: string;
    email: string;
    role: string;
  }

  interface Request {
    user?: UserPayload;
  }
}
