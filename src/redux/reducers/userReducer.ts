import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import User from "../../models/User";
import { Role } from "../../models/RoleModel";
import Status from "../types/types";


export interface UserState {
    userData: User | {};
    accessToken: string | null;
    rolesUser: Role[] | null;
    users: User[] | []
    roles: Role[] | [];
    statuses: Status[] | [];
}

const initialState: UserState = {
    userData: {},
    accessToken: null,
    rolesUser: null,
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
                accessToken: token,
                rolesUser: userData.roles
            };
        },
        logOut: (state, action: PayloadAction<{}>) => {
            state.userData = action.payload;
            state.accessToken = null;
            state.rolesUser = null;
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