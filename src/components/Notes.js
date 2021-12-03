import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { onSnapshot, updateDoc, query, doc, collection, orderBy, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";
import { Editor, EditorState, convertFromRaw, convertToRaw } from "draft-js";

const Notes = () => {
	const user = useSelector(selectUser),
		[notes, setNotes] = useState([]);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users", user?.email, "notes"), orderBy("updated", "desc")),
			(snap) => {
				setNotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
			}
		);
		return unsubscribe;
	}, [user]);

	return (
		<div className="notes">
			{notes?.map((note) => (
				<SingleNote note={note} key={note.id} />
			))}
		</div>
	);
};

export default Notes;

const SingleNote = ({ note }) => {
	const user = useSelector(selectUser),
		[editorState, setEditorState] = useState(() => EditorState.createWithContent(convertFromRaw(note.note)));

	const changeHandler = (newState) => {
		setEditorState(newState);
		if (
			!newState?.getSelection()?.getHasFocus() &&
			newState.getCurrentContent().getPlainText() !== convertFromRaw(note.note).getPlainText()
		) {
			console.log("updating");
			updateDoc(doc(db, "users", user?.email, "notes", note?.id), {
				note: convertToRaw(editorState?.getCurrentContent()),
				updated: serverTimestamp(),
			}).catch((err) => console.log(err));
		}
	};

	return (
		<div className="note">
			<h3>{note.title}</h3>
			<Editor editorState={editorState} onChange={changeHandler} />
			{/* <p>{note.note}</p> */}
		</div>
	);
};
