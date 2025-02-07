import { AuthState } from '@/types/Auth'
import { User } from '@/types/Users'
import { create } from 'zustand'

export const useAuthStore = create<AuthState>()(
    (set) => ({

        user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
        token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,

        setUser: (user: User) => {
            localStorage.setItem('user', JSON.stringify(user));
            set({ user });
        },

        setToken: (token: string, role: string) => {
            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            set({ token });
        },

        logout: () => {

            localStorage.removeItem('')
        }
    })
)