import { Text, View, ScrollView } from 'react-native';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { ListItem } from '@rneui/themed';
import { Button } from '@rneui/base';

const UserList = () => {
  const { data, isLoading, refetch } = useGetUsersQuery({});

  const handleRefetch = () => {
    console.log('refetching');
    refetch();
    console.log('Refetch function called.');
  };

  console.log('data: ', data);
  return (
    <ScrollView style={{ flex: 1 }}>
      <View>
        {isLoading ? (
          <Text>Loading...</Text>
        ) : (
          <View>
            {data?.map((user) => (
              <ListItem>
                <ListItem.Content>
                  <ListItem.Title>{`${user.firstName} ${user.lastName}`}</ListItem.Title>
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
