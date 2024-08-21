import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { Role } from "../../models/RoleModel";
import Status from "../types/types";


export interface UserState {
    userData: User | {};
    accessToken: string | null;
    role: string | null;
    users: User[] | null
    roles: Role[] | null;
    statuses: Status[] | null;
}

const initialState: UserState = {
    userData: {},
    accessToken: null,
    role: "admin",
    users: [],
    roles: [],
    statuses: [],

};
const Slice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        loginUser: (state, action: PayloadAction<User>) => {
            const { token, ...userData } = action.payload;
            return {
                ...state,
                userData: userData,
                accessToken: token
            };
        },
        logOut: (state, action: PayloadAction<{}>) => {
            state.userData = action.payload;
            state.accessToken = null;
        },
        setUsers: (state, action: PayloadAction<User[]>) => {
            state.users = action.payload;
        },
        setRoles: (state, action: PayloadAction<Role[]>) => {
            state.roles = action.payload;
        },
        setStatuses: (state, action: PayloadAction<Status[]>) => {
            state.statuses = action.payload;
        },
       
    }
});

export const { loginUser, logOut, setUsers, setRoles, setStatuses } = Slice.actions;
export default Slice.reducer;