import { createSlice } from "@reduxjs/toolkit";

export interface UserState {
    email: string | null,
    username: string | null,
    userId: string | null,
    token: string | null,
    isAuthorized: boolean,
    balance: number,
}

const initialState : UserState = {
    email: null,
    username: null,
    userId: null,
    token: null,
    isAuthorized: false, 
    balance: 0
}

export const AuthSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        authorize: (state, action) => {
            state.userId = action.payload.user?.id || action.payload.user?.userId;
            state.username = action.payload.user?.username;
            state.token = action.payload.token;
            state.email = action.payload.user?.email;
            state.balance = action.payload.user?.balance || 0;
            state.isAuthorized = true;
        },
        logout: (state) => {
            state.userId = null;
            state.username = null;
            state.token = null;
            state.isAuthorized = false;
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        },
        setBalance: (state, action) => {
            state.balance = action.payload.balance;
        },
        setUser: (state, action) => {
            state.userId = action.payload.userId;
        }
    }
})

export const { authorize, logout, setBalance, setUser } = AuthSlice.actions;

export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectBalance = (state: {user: UserState}) => state.user.balance;
export const selectUsername = (state: {user: UserState}) => state.user.username;
export const selectAuthState = (state: {user: UserState}) => state.user.isAuthorized;
export const selectId = (state: {user: UserState}) => state.user.userId;

export default AuthSlice.reducer;