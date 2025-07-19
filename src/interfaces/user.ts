export interface User {
    id: number;
    username: string;
    password_hash: string;
    role: 'admin' | 'employee';
    created_at: Date;
  }