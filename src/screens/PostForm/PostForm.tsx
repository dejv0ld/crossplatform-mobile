import { Text, View } from 'react-native';
import { Input, Button } from '@rneui/base';
import { useCreatePostMutation } from '../../store/api/postsApi';
import React, { useRef, useState } from 'react';
import { logIn, logOut } from '../../store/slices/authSlice';
import { useDispatch, useSelector } from 'react-redux';

export const PostForm = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  const [createPost, { isLoading, isError, error }] = useCreatePostMutation();
  const [postText, setPostText] = useState('');

  const handleCreatePost = async () => {
    try {
      await createPost({
        post: {
          text: postText,
          createdBy: loggedInAs.id,
          userName: `${loggedInAs.firstName} ${loggedInAs.lastName}`,
          createdDate: new Date().toLocaleDateString()
        }
      });
      setPostText('');
    } catch (error) {
      console.error('Error creating post!', error);
    }
  };

  return (
    <View>
      <Text>Post Form</Text>
      <Input placeholder="post" value={postText} onChangeText={setPostText} />
      <Button onPress={() => handleCreatePost()}>Post</Button>
    </View>
  );
};
