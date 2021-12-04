import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectUser } from "../redux/slices/userSlice";
import { onSnapshot, query, collection, doc, orderBy, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import SingleNote from "./SingleNote";
import Loader from "./Loader";

const Notes = () => {
	const user = useSelector(selectUser),
		[notes, setNotes] = useState([]),
		[loading, setLoading] = useState(true);

	useEffect(() => {
		const unsubscribe = onSnapshot(
			query(collection(db, "users", user?.email, "notes"), orderBy("updated", "desc")),
			(snap) => {
				setLoading(true);
				setNotes(snap.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
				setLoading(false);
			}
		);
		return unsubscribe;
	}, [user]);

	const deleteNote = (noteId) => {
		setLoading(true);
		deleteDoc(doc(db, "users", user?.email, "notes", noteId))
			.catch((err) => console.log(err))
			.finally(() => setLoading(false));
	};

	return (
		<>
			{loading && <Loader />}
			<NotesSm notes={notes} deleteNote={deleteNote} />
			<NotesMd notes={notes} deleteNote={deleteNote} />
			<NotesLg notes={notes} deleteNote={deleteNote} />
			<NotesXl notes={notes} deleteNote={deleteNote} />
		</>
	);
};

export default Notes;

// 1 col
const NotesSm = ({ notes, deleteNote }) => (
	<div className="notes sm">
		<div>
			{notes?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
	</div>
);
// 2 cols
const NotesMd = ({ notes, deleteNote }) => (
	<div className="notes md">
		<div>
			{notes?.filter((_, index) => index%2 === 0)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%2 !== 0)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
	</div>
);
// 3 cols
const NotesLg = ({ notes, deleteNote }) => (
	<div className="notes lg">
		<div>
			{notes?.filter((_, index) => index%3 === 0)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%3 === 1)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%3 === 2)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
	</div>
);
// 4 cols
const NotesXl = ({ notes, deleteNote }) => (
	<div className="notes xl">
		<div>
			{notes?.filter((_, index) => index%4 === 0)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%4 === 1)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%4 === 2)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
		<div>
			{notes?.filter((_, index) => index%4 === 3)?.map((note) => (
				<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
			))}
		</div>
	</div>
);
