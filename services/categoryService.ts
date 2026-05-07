import { firestore } from '@/config/firebase';
import { addDoc, collection, doc, Timestamp, updateDoc } from 'firebase/firestore';

export const createOrUpdateCategory = async (categoryData: any) => {
	try {
		const { id, ...data } = categoryData;

		if (id) {
			const categoryRef = doc(firestore, 'categories', id);
			await updateDoc(categoryRef, {
				...data,
				updatedAt: Timestamp.now(),
			});
		} else {
			await addDoc(collection(firestore, 'categories'), {
				...data,
				createdAt: Timestamp.now(),
			});
		}

		return { success: true };
	} catch (error: any) {
		console.log('Error creating category: ', error);
		return { success: false, msg: error.message };
	}
};
