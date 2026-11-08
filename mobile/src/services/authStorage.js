/**
 * Auth Storage Service
 * Handles JWT access & refresh tokens securely.
 * Prepares the mobile application for Django SimpleJWT backend authentication.
 */
let inMemoryTokens = {
  accessToken: null,
  refreshToken: null,
  user: null,
};

export const authStorage = {
  async setSession(tokens, user) {
    inMemoryTokens = {
      accessToken: tokens.access || tokens.accessToken || null,
      refreshToken: tokens.refresh || tokens.refreshToken || null,
      user: user || null,
    };
    return true;
  },

  async getAccessToken() {
    return inMemoryTokens.accessToken;
  },

  async getRefreshToken() {
    return inMemoryTokens.refreshToken;
  },

  async getUser() {
    return inMemoryTokens.user;
  },

  async clearSession() {
    inMemoryTokens = {
      accessToken: null,
      refreshToken: null,
      user: null,
    };
    return true;
  },

  isAuthenticated() {
    return !!inMemoryTokens.accessToken || !!inMemoryTokens.user;
  }
};
