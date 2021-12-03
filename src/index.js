import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { store } from "./redux/store";
import { Provider } from "react-redux";
// css imports
import "./assets/css/index.css";
import "./assets/css/variables.css";
import "./assets/css/login.css";
import "./assets/css/home.css";
import "./assets/css/navbar.css";
import "./assets/css/form.css";
import "./assets/css/notes.css";
import "draft-js/dist/Draft.css";

ReactDOM.render(
	<React.StrictMode>
		<Provider store={store}>
			<App />
		</Provider>
	</React.StrictMode>,
	document.getElementById("root")
);
