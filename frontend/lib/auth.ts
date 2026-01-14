'use client'

import Cookies from 'js-cookie'

export const AUTH_TOKEN_KEY = 'auth-token'

export const authUtils = {
  setToken: (token: string, days: number = 7) => {
    Cookies.set(AUTH_TOKEN_KEY, token, { 
      expires: days,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })
  },

  getToken: (): string | undefined => {
    return Cookies.get(AUTH_TOKEN_KEY)
  },

  removeToken: () => {
    Cookies.remove(AUTH_TOKEN_KEY)
  },

  isAuthenticated: (): boolean => {
    return !!Cookies.get(AUTH_TOKEN_KEY)
  },

  logout: () => {
    Cookies.remove(AUTH_TOKEN_KEY)
    window.location.href = '/login'
  }
}
