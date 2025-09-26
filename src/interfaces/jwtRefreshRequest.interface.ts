export interface IJwtRefreshRequest {
  user: {
    id: string;
    email: string;
    refreshToken: string;
  };
}
