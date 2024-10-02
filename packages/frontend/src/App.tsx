import Login from "./pages/auth/Login";
import CreatePost from "./pages/posts/CreatePost";
import AllPost from "./pages/posts/AllPosts";
import { useAppSelector } from "./store";
import UserSpecificPosts from "./pages/posts/UserSpecificPosts";
import { RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";
import Posts from "./pages/posts/Posts";
import EditPost from "./pages/posts/EditPost";
import NotFound from "./pages/404";
import Register from "./pages/auth/Register";
import "./App.css";

const App = () => {
	const authState = useAppSelector((state) => state.auth);
	const isAuthenticated = authState.user !== null && authState.token !== null;

	const router = createBrowserRouter([
    	{
        	path: "/",
        	element: (
            	<Login authState={authState} isAuthenticated={isAuthenticated} />
        	),
        	children: [
            	{
                	path: "register",
                	element: (
                    	<Register authState={authState} isAuthenticated={isAuthenticated} />
                	),
            	},
        	],
    	},
    	{
        	path: "/post/create/",
        	element: (
            	<CreatePost isAuthenticated={isAuthenticated} authState={authState} />
        	),
    	},
    	{
        	path: "/posts/",
        	element: (
            	<Posts isAuthenticated={isAuthenticated} authState={authState} />
        	),
        	children: [
            	{
                	path: "",
                	element: <AllPost />,
            	},
            	{
                	path: "user/:username",
                	element: <UserSpecificPosts isAuthenticated={isAuthenticated} />,
                	loader: async ({ params }) => {
                    	return params.username;
                	},
            	},
            	{
                	path: "user/:username/post/edit/:postId",
                	element: <EditPost isAuthenticated={isAuthenticated} />,
                	loader: ({ params }) => {
                    	return { username: params.username, postId: params.postId };
                	},
            	},
        	],
    	},
    	{
        	path: "*",
        	element: <NotFound />,
    	},
	]);

	return (
    	<div>
        	<RouterProvider router={router} />
    	</div>
	);
};

export default App;