import {
  collection,
  doc,
  setDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy
} from 'firebase/firestore';
import { db } from './config';
import type { ContentType } from '../api/types';

export interface UserReview {
  id: string;
  userId: string;
  userName: string;
  userPhoto: string | null;
  rating: number; // 1-10
  reviewText: string;
  createdAt: any;
  updatedAt: any;
}

export const submitReview = async (
  mediaId: number,
  mediaType: ContentType,
  userId: string,
  userName: string,
  userPhoto: string | null,
  rating: number,
  reviewText: string
) => {
  const reviewRef = doc(db, `reviews/${mediaType}_${mediaId}/userReviews/${userId}`);
  
  const reviewData = {
    userId,
    userName,
    userPhoto,
    rating,
    reviewText,
    updatedAt: serverTimestamp(),
  };

  // Check if exists to set createdAt
  const existing = await getDoc(reviewRef);
  if (!existing.exists()) {
    (reviewData as any).createdAt = serverTimestamp();
  }

  await setDoc(reviewRef, reviewData, { merge: true });
};

export const getReviewsForMedia = async (mediaId: number, mediaType: ContentType): Promise<UserReview[]> => {
  const reviewsRef = collection(db, `reviews/${mediaType}_${mediaId}/userReviews`);
  const q = query(reviewsRef, orderBy('updatedAt', 'desc'));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as UserReview[];
};

export const getUserReviewForMedia = async (mediaId: number, mediaType: ContentType, userId: string): Promise<UserReview | null> => {
  const reviewRef = doc(db, `reviews/${mediaType}_${mediaId}/userReviews/${userId}`);
  const snapshot = await getDoc(reviewRef);
  
  if (snapshot.exists()) {
    return { id: snapshot.id, ...snapshot.data() } as UserReview;
  }
  return null;
};
