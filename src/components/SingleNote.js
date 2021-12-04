import { useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { updateDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Editor, EditorState, convertFromRaw, convertToRaw, RichUtils } from "draft-js";
import TrashIcon from "@heroicons/react/solid/TrashIcon";
import IconButton from "@mui/material/IconButton";

const SingleNote = ({ note, deleteNote }) => {
	const user = useSelector(selectUser),
		[editorState, setEditorState] = useState(() => EditorState.createWithContent(convertFromRaw(note.note))),
		[saving, setSaving] = useState(false);

	const isChanged = () => {
		return editorState.getCurrentContent().getPlainText() !== convertFromRaw(note.note).getPlainText();
	};

	const changeHandler = (newState) => {
		setEditorState(newState);
		if (
			!newState?.getSelection()?.getHasFocus() &&
			newState.getCurrentContent().getPlainText() !== convertFromRaw(note.note).getPlainText()
		) {
			setSaving(true);
			updateDoc(doc(db, "users", user?.email, "notes", note?.id), {
				note: convertToRaw(editorState?.getCurrentContent()),
				updated: serverTimestamp(),
			})
				.catch((err) => console.log(err))
				.finally(() => setSaving(false));
		}
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			setEditorState(newState);
		}
	};

	return (
		<div className="note">
			<IconButton onClick={() => deleteNote(note?.id)} className="note__deleteBtn">
				<TrashIcon className="icon" />
			</IconButton>
			<h3>{note.title}</h3>
			<Editor editorState={editorState} onChange={changeHandler} handleKeyCommand={handleKeyCommand} />
			{(isChanged() || saving) && (
				<div className="note__loading">
					{saving ? (
						<>
							<div></div>
							<p>Saving</p>
						</>
					) : (
						<p>Unsaved Changes</p>
					)}
				</div>
			)}
		</div>
	);
};

export default SingleNote;
