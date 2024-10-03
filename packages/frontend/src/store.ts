import { configureStore, createListenerMiddleware } from "@reduxjs/toolkit";  // Added createListenerMiddleware
import { blogApi } from "./services/posts/blogSlice";
import { authBlogApi, refreshAuthentication } from "./services/auth/authSlice";
import authReducer from "./services/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query";

// Create authListener middleware
const authListener = createListenerMiddleware();

const store = configureStore({
    reducer: {
        [blogApi.reducerPath]: blogApi.reducer,
        [authBlogApi.reducerPath]: authBlogApi.reducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(authBlogApi.middleware)
            .concat(blogApi.middleware)
            .concat(authListener.middleware); // Add authListener middleware here
    },
});

// Add this line below the store variable
setupListeners(store.dispatch);

/**
 *  This is a very _common pattern_ for Redux.
 **/
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export default store;

// Add the custom listener at the end to handle refresh persistence
authListener.startListening.withTypes<RootState, AppDispatch>()({
    predicate(_action, currentState, _originalState) {
        return (
            currentState.auth.token === null &&
            currentState.auth.user === null &&
            sessionStorage.getItem("isAuthenticated") === "true"
        );
    },
    effect: async (_action, listenerApi) => {
        console.log("Needs update");
        listenerApi.dispatch(refreshAuthentication());
        await listenerApi.delay(800);
    },
});
