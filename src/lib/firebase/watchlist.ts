import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import type { TMDBSearchItem, ContentType } from '../api/types';

export type WatchlistStatus = 'want_to_watch' | 'watching' | 'watched';

export interface WatchlistItem {
  mediaId: number;
  mediaType: ContentType;
  title: string;
  posterPath: string | null;
  status: WatchlistStatus;
  seen: boolean;
  liked: boolean | null;
  addedAt: any;
}

export const addToWatchlist = async (
  userId: string,
  mediaId: number,
  mediaType: ContentType,
  title: string,
  posterPath: string | null,
  status: WatchlistStatus = 'want_to_watch'
) => {
  const itemRef = doc(db, `users/${userId}/watchlist/${mediaId}`);
  
  const item: WatchlistItem = {
    mediaId,
    mediaType,
    title,
    posterPath,
    status,
    seen: false,
    liked: null,
    addedAt: serverTimestamp(),
  };

  await setDoc(itemRef, item, { merge: true });
  return item;
};

export const updateWatchlistStatus = async (
  userId: string,
  mediaId: number,
  status: WatchlistStatus
) => {
  const itemRef = doc(db, `users/${userId}/watchlist/${mediaId}`);
  await setDoc(itemRef, { status }, { merge: true });
};

export const updateWatchlistInteraction = async (
  userId: string,
  mediaId: number,
  updates: { seen?: boolean; liked?: boolean | null }
) => {
  const itemRef = doc(db, `users/${userId}/watchlist/${mediaId}`);
  await setDoc(itemRef, updates, { merge: true });
};

export const removeFromWatchlist = async (userId: string, mediaId: number) => {
  const itemRef = doc(db, `users/${userId}/watchlist/${mediaId}`);
  await deleteDoc(itemRef);
};

export const getUserWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
  const watchlistRef = collection(db, `users/${userId}/watchlist`);
  const q = query(watchlistRef, orderBy('addedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as WatchlistItem);
};

export const getWatchlistItem = async (userId: string, mediaId: number): Promise<WatchlistItem | null> => {
  const itemRef = doc(db, `users/${userId}/watchlist/${mediaId}`);
  const snapshot = await getDoc(itemRef);
  
  if (snapshot.exists()) {
    return snapshot.data() as WatchlistItem;
  }
  return null;
};
