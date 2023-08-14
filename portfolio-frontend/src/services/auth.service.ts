class AuthService {
  static instance: AuthService;
  static getInstance() {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }

    return AuthService.instance;
  }

  constructor() {}

  public getDefaultHeaders = () => {
    return {
      'X-API-KEY': VISITOR_API_KEY,
      'Content-Type': 'application/json',
    };
  }
}

export const authService = AuthService.getInstance();
