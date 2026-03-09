import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserState {
    email: string | null,
    username: string | null,
    token: string | null,
    isAuthorized: boolean,
    balance: number,
}

const initialState : UserState = {
    email: null,
    username: null,
    token: null,
    isAuthorized: false, 
    balance: 0
}

export const AuthSlice = createSlice({
    name: 'user',
    initialState: initialState,
    reducers: {
        authorize: (state, action) => {
            state.username = action.payload.user.username;
            state.token = action.payload.token;
            state.email = action.payload.user.email;
            state.balance = action.payload.user.balance;
            state.isAuthorized = true
        },
        logout: (state, action) => {
            state.username = null;
            state.token = null;
            state.isAuthorized = false
        },
        setBalance: (state, action) => {
            state.balance = action.payload.balance
        }
    }
})

export const { authorize, logout, setBalance } = AuthSlice.actions;

export const selectToken = (state: { user: UserState }) => state.user.token;
export const selectBalance = (state: {user: UserState}) => state.user.balance;
export const selectUsername = (state: {user: UserState}) => state.user.username;
export const selectAuthState = (state: {user: UserState}) => state.user.isAuthorized;

export default AuthSlice.reducer;