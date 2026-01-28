import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export const usePantryData = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expiringSoonCount, setExpiringSoonCount] = useState(0);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(collection(db, "items"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const itemsArray: any[] = [];
      let expiringCount = 0;
      const nextThreeDays = new Date();
      nextThreeDays.setDate(new Date().getDate() + 3);

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        itemsArray.push({ id: doc.id, ...data });
        if (new Date(data.expiryDate) <= nextThreeDays) expiringCount++;
      });

      setItems(itemsArray);
      setExpiringSoonCount(expiringCount);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { items, loading, expiringSoonCount };
};