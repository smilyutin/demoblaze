export const randomUsername = (prefix = 'user') => `${prefix}_${Date.now()}_${Math.floor(Math.random()*1000)}`;
export const randomEmail = (prefix = 'qa') => `${prefix}+${Date.now()}@example.com`;
export const randomWord = () => Math.random().toString(36).slice(2, 8);