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
			<div className="notes">
				{notes?.map((note) => (
					<SingleNote note={note} key={note.id} deleteNote={deleteNote} />
				))}
			</div>
		</>
	);
};

export default Notes;
