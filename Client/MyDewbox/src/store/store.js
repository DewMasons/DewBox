// store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
export const useStore = create((set) => ({
    email: '',
    setEmail: (email) => set({ email }),
    formData: {},
    setFormData: (data) => set({ formData: { ...data } }),
}));