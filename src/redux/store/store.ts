import { configureStore } from '@reduxjs/toolkit';
import userReducer from "../reducers/userReducer"
import promotionReducer from '../reducers/promotionReducer';
import partnerReducer from '../reducers/partnerReducer';
import globalDataReducer from '../reducers/globalDataReducer';

export const store = configureStore({
    reducer: {
       user: userReducer,
       promotions: promotionReducer,
       partner: partnerReducer,
       globalData: globalDataReducer,
    },
});
// Documentacion Redux
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch