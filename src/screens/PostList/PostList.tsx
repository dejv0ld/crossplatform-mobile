import { FlatList, Text, View, RefreshControl } from 'react-native';
import { Card, Button } from '@rneui/base';
import {
  useGetPostsQuery,
  useDeletePostMutation
} from '../../store/api/postsApi';
import { useToast } from 'react-native-toast-notifications';
import { current } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import { styles } from './postlistStyles';

export const PostList = () => {
  const { data: posts, isLoading, refetch } = useGetPostsQuery({});
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const toast = useToast();
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      refetch();
      toast.show('Post deleted successfully.', {
        type: 'success',
        placement: 'top',
        duration: 3000,
        animationType: 'zoom-in'
      });
    } catch (error) {
      console.error(error);
      toast.show('Error deleting post', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in'
      });
    }
  };

  // Function to render each post item
  const renderItem = ({ item: post }) => (
    <Card containerStyle={styles.cards} key={post.id}>
      <Card.Title>{`${post.userName} - Posted: ${post.createdDate}`}</Card.Title>
      <Card.Divider />
      <Text>{post.text}</Text>
      { /*Show delete button if logged in user is the creator of the post */}
      {loggedInAs &&
        post &&
        post.createdBy &&
        loggedInAs.id === post.createdBy && (
          <Button
            buttonStyle={styles.deleteButton}
            title="Delete Post"
            loading={isDeleting}
            onPress={() => handleDeletePost({ postId: post.id })}
          >
            Delete Post
          </Button>
        )}
    </Card>
  );

  return (
    <FlatList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(post) => post.id}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={refetch} />
      }
    />
  );
};
