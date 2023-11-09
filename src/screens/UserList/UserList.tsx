import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { ListItem } from '@rneui/themed';
import { Button } from '@rneui/base';
import { styles } from './userlistStyles';

const UserList = ({ navigation }) => {
  const { data, isLoading, refetch } = useGetUsersQuery({});

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
            {data?.map((item) => (
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
                      onPress={() => navigation.navigate('UserForm', {user: item})}
                    >
                      Edit
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
