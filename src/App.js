import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { login, logout, selectUser } from "./redux/slices/userSlice";

function App() {
	const dispatch = useDispatch(),
		user = useSelector(selectUser);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			if (user) {
				const obj = {
					name: user.displayName,
					email: user.email,
					photo: user.photoURL,
				};
				dispatch(login(obj));
			} else dispatch(logout());
		});
	}, [dispatch]);

	return <div className="">{!user ? <Login /> : <Home />}</div>;
}

export default App;
