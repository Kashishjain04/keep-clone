import IconButton from "@mui/material/IconButton";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { signOut } from "@firebase/auth";
import { auth } from "../firebase";

const Navbar = () => {
	const user = useSelector(selectUser);

	return (
		<div className="navbar">
			<div className="navbar__logo">
				<img src="/logo.png" alt="logo" />
				<p>Keep Notes</p>
			</div>
			<IconButton onClick={() => signOut(auth).catch((err) => console.log(err))} className="navbar__right">
				<Avatar src={user?.photo}>{user?.name[0]}</Avatar>
			</IconButton>
		</div>
	);
};

export default Navbar;
