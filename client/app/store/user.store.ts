import { create } from 'zustand'
import load from '../lib/load'

type LoggedUser = {
  user: AuthUser,
  token: string
}

type User = {
  username: string
  email: string
  password: string
}

interface AuthUser extends Omit<User, 'password'> {
  id: number
  role: string
}
interface UserStore {
  authUser: AuthUser | null
  isAuth: boolean | undefined
  register: (body: User) => Promise<boolean | undefined>
  login: (body: Omit<User, 'username'>) => Promise<boolean | undefined>
  logout: () => void
  loadUser: () => Promise<void>
}

export const useUserStore = create<UserStore>((set, get) => ({
  authUser: null,
  isAuth: undefined,
  register: async (body: User) => {
    const res = await load<User, LoggedUser>({ endpoint: 'auth/register/', method: 'POST', body, auth: false });
    if (!res) {
      set({ authUser: null });
      set({ isAuth: false });
      localStorage.removeItem('token');
    }

    else {
      set({ authUser: res.user });
      set({ isAuth: true });
      localStorage.setItem('token', res.token);
    }

    return get().isAuth
  },

  login: async (body: Omit<User, 'username'>) => {
    const res = await load<Omit<User, 'username'>, LoggedUser>({ endpoint: 'auth/login/', method: 'POST', body, auth: false });
    if (!res) {
      set({ authUser: null });
      set({ isAuth: false });
      localStorage.removeItem('token');
    }

    else {
      set({ authUser: res.user });
      set({ isAuth: true });
      localStorage.setItem('token', res.token);
    }

    return get().isAuth
  },

  logout: () => {
    set({ authUser: null });
    set({ isAuth: false });
    localStorage.removeItem('token');
  },

  loadUser: async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      set({ authUser: null });
      set({ isAuth: false });
      return;
    }

    if(get().authUser){
      return; 
    }

    const user = await load<void, AuthUser>({ endpoint: 'auth/profile/' });
    if (!user) {
      set({ authUser: null });
      set({ isAuth: false });
      localStorage.removeItem('token');
      return;
    }

    set({ authUser: user });
    set({ isAuth: true });

  }
}))