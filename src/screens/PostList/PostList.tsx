import { FlatList, Text, View, RefreshControl } from 'react-native';
import { Card, Button } from '@rneui/base';
import { useGetPostsQuery } from '../../store/api/postsApi';

export const PostList = () => {
  const { data: posts, isLoading, refetch } = useGetPostsQuery({});

  // Function to render each post item
  const renderItem = ({ item: post }) => (
    <Card key={post.id}>
      <Card.Title>{`${post.userName} - ${post.createdDate}`}</Card.Title>
      <Card.Divider />
      <Text>{post.text}</Text>
      {/* Add any other post details or actions here */}
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
      // You can add other FlatList props as needed
    />
  );
};
