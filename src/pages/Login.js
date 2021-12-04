import { doc, setDoc } from "@firebase/firestore";
import { signInWithPopup, GoogleAuthProvider, getAdditionalUserInfo } from "firebase/auth";
import { auth, db } from "../firebase";

const provider = new GoogleAuthProvider();

const Login = () => {	
	const createDoc = (user) => {
		setDoc(
			doc(db, "users", user.profile.email),
			{
				name: user.profile.name,
				email: user.profile.email,
				photo: user.profile.picture
			},
			{ merge: true }
		).catch((err) => console.log(err));
	};

	const loginHandler = () => {
		signInWithPopup(auth, provider)
			.then((res) => {
				const additionalInfo = getAdditionalUserInfo(res);
				if (additionalInfo.isNewUser) createDoc(additionalInfo);
			})
			.catch((err) => console.log(err));
	};
	return (
		<div className="login">
			<div className="login__logo">
				<img alt="logo" src="/logo.png" />
			</div>
			<div onClick={loginHandler} className="google-btn">
				<div className="google-icon-wrapper">
					<img
						alt="google-icon"
						className="google-icon"
						src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
					/>
				</div>
				<p className="btn-text">
					<b>Sign in with google</b>
				</p>
			</div>
		</div>
	);
};

export default Login;
