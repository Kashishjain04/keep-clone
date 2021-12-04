import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Loader from "./components/Loader";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { login, logout, selectUser } from "./redux/slices/userSlice";

function App() {
	const dispatch = useDispatch(),
		user = useSelector(selectUser),
		[loading, setLoading] = useState(true);

	useEffect(() => {
		auth.onAuthStateChanged((user) => {
			setLoading(true);
			if (user) {
				const obj = {
					name: user.displayName,
					email: user.email,
					photo: user.photoURL,
				};
				dispatch(login(obj));
				setLoading(false);
			} else {
				dispatch(logout());
				setLoading(false);
			}
		});
	}, [dispatch]);

	return loading ? <Loader /> : <div className="">{!user ? <Login /> : <Home />}</div>;
}

export default App;
