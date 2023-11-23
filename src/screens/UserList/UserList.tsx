import { Text, View, ScrollView, RefreshControl } from 'react-native';
import {
  useGetUsersQuery,
  useDeleteUserMutation
} from '../../store/api/usersApi';
import { ListItem } from '@rneui/themed';
import { Button } from '@rneui/base';
import { styles } from './userlistStyles';
import { useToast } from 'react-native-toast-notifications';
import {useMemo} from 'react';

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const toast = useToast();

  const sortedUsers = useMemo(() => {
    if (!data) return [];

    return [...data].sort((a, b) => {
      const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
      const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });
  }, [data]);

  const handleDelete = async (userId) => {
    try {
      await deleteUser(userId);
      refetch();
      toast.show('User deleted successfully.', {
        type: 'success',
        placement: 'top',
        duration: 3000,
        animationType: 'zoom-in'
      });
    } catch (error) {
      console.error(error);
      toast.show('Error deleting user', {
        type: 'danger',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in'
      });
    }
  };

  // refetch is a function that can be called to refetch the data for the query
  const handleRefetch = () => {
    console.log('refetching');
    refetch();
    console.log('Refetch function called.');
  };

  console.log('data: ', data);
  return (
    <ScrollView
      style={{ flex: 1 }}
      refreshControl={
        <RefreshControl refreshing={isLoading} onRefresh={handleRefetch} />
      }
    >
      <View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
            {sortedUsers.map((item) => (
              <ListItem
                key={item.id}
                onPress={() => {
                  navigation.navigate('UserInfo', { user: item });
                }}
              >
                <ListItem.Content style={styles.container}>
                  <ListItem.Title style={styles.itemName}>
                    {`${item.firstName} ${item.lastName}`}
                    <Button
                      title="Edit User"
                      onPress={() =>
                        navigation.navigate('UserForm', { user: item })
                      }
                    >
                      Edit
                    </Button>
                    <Button
                      onPress={() => handleDelete({ userId: item.id })}
                      loading={isDeleting}
                      title="Delete User"
                    >
                      Delete
                    </Button>
                  </ListItem.Title>
                </ListItem.Content>
              </ListItem>
            ))}
          </View>
        )}
        <Button title="Reload" onPress={handleRefetch}>
          Reload
        </Button>
      </View>
    </ScrollView>
  );
};

export default UserList;
