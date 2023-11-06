import { Text, View, ScrollView } from 'react-native';
import { useGetUsersQuery } from '../../store/api/usersApi';
import { ListItem } from '@rneui/themed';
import { Button } from '@rneui/base';

const UserList = ({ navigation }) => {
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
            {data?.map((item) => (
              <ListItem
                key={item.id}
                onPress={() => {
                  navigation.navigate('UserInfo', { user: item });
                }}
              >
                <ListItem.Content>
                  <ListItem.Title>{`${item.firstName} ${item.lastName}`}</ListItem.Title>
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
