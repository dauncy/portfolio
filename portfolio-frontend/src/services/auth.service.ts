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
      'X-API-KEY': '6149a961-582c-4f12-8ca4-0ee3988f3878',
      'Content-Type': 'application/json',
    };
  }
}

export const authService = AuthService.getInstance();
