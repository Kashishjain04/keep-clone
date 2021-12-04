import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import IconButton from "@mui/material/IconButton";
import PlusIcon from "@heroicons/react/solid/PlusIcon";
import { addDoc, collection, serverTimestamp } from "@firebase/firestore";
import { db } from "../firebase";
import { Editor, EditorState, convertToRaw, RichUtils } from "draft-js";

const Form = () => {
	const user = useSelector(selectUser),
		[title, setTitle] = useState(""),
		[editorState, setEditorState] = useState(() => EditorState.createEmpty());

	const addNote = () => {
		const editorContent = editorState?.getCurrentContent();
		if (!title || !editorContent.hasText()) return alert("please fill required fields!!");
		addDoc(collection(db, "users", user.email, "notes"), {
			title,
			note: convertToRaw(editorContent),
			created: serverTimestamp(),
			updated: serverTimestamp(),
		})
			.then(() => {
				setTitle("");
				setEditorState(() => EditorState.createEmpty());
			})
			.catch((err) => console.log(err));
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if(newState){
			setEditorState(newState);
		}
	}

	return (
		<form onSubmit={(e) => e.preventDefault()} className="form">
			<input
				type="text"
				placeholder="Title"
				onChange={(e) => setTitle(e.target.value)}
				value={title}
				required
			/>
			<Editor placeholder="Take a note..." editorState={editorState} onChange={setEditorState} handleKeyCommand={handleKeyCommand} />
			<IconButton onClick={addNote} className="form__btn">
				<PlusIcon className="icon" />
			</IconButton>
		</form>
	);
};

export default Form;
