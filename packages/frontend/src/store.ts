import { configureStore } from "@reduxjs/toolkit";
import { blogApi } from "./services/posts/blogSlice";
import { authBlogApi, refreshAuthentication } from "./services/auth/authSlice";
import authReducer from "./services/auth/authSlice";
import { useSelector, useDispatch } from "react-redux";
import { setupListeners } from "@reduxjs/toolkit/query"; // Add this import

const store = configureStore({
	reducer: {
    	[blogApi.reducerPath]: blogApi.reducer,
    	[authBlogApi.reducerPath]: authBlogApi.reducer,
    	auth: authReducer,
	},
	middleware: (getDefaultMiddleware) => {
    	return getDefaultMiddleware()
        	.concat(authBlogApi.middleware)
        	.concat(blogApi.middleware);
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
