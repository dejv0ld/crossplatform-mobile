import { createApi } from '@reduxjs/toolkit/query/react';
import { db } from '../../../firebase-config';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, setDoc } from 'firebase/firestore';

const firebaseBaseQuery = async ({ baseUrl, url, method, body }) => {
  switch (method) {
    case 'GET':
      const snapshot = await getDocs(collection(db, url));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      return { data };

    case 'POST':
      const docRef = await addDoc(collection(db, url), body);
      return { data: { id: docRef.id, ...body } };

    case 'DELETE':
      const deleteRef = doc(db, url);
      await deleteDoc(deleteRef);
      return { data: 'Deleted successfully' };
    /*
                case 'PUT':
                  const putRef = doc(db, url);
                  await setDoc(putRef, body, { merge: true });
                  return { data: 'Updated successfully' }; */

    default:
      throw new Error(`Unhandled method ${method}`);
  }

};

export const postsApi = createApi({
  reducerPath: 'postsApi',
  baseQuery: firebaseBaseQuery,
  tagTypes: ['posts'],
  endpoints: (builder) => ({
    createPost: builder.mutation({
      query: ({ post }) => ({
        baseUrl: '',
        url: 'posts',
        method: 'POST',
        body: post
      }),
      invalidatesTags: ['posts'],
    }),
    getPosts: builder.query({
      query: () => ({
        baseUrl: '',
        url: 'posts',
        method: 'GET',
        body: ''
      }),
      providesTags: ['posts'],
    }),
    deletePost: builder.mutation({
      query: ({ postId }) => ({
        baseUrl: '',
        url: `posts/${postId}`,
        method: 'DELETE',
        body: ''
      }),
      invalidatesTags: ['posts'],
    }),
  })
})

export const { useCreatePostMutation, useGetPostsQuery, useDeletePostMutation } = postsApi;
