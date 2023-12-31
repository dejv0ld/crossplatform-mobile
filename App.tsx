import * as React from 'react';

import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserList from './src/screens/UserList/UserList';
import { Provider, useSelector } from 'react-redux';
import { persistor, store } from './src/store/store';
import { UserForm } from './src/screens/UserForm/UserForm';
import { ToastProvider } from 'react-native-toast-notifications';
import { UserInfo } from './src/screens/UserInfo/UserInfo';
import { PersistGate } from 'redux-persist/integration/react';
import { PostForm } from './src/screens/PostForm/PostForm';
import { PostList } from './src/screens/PostList/PostList';

//TAB NAVIGATION BELOW
const UserListStack = createNativeStackNavigator();
const UserListStackScreen = () => {
  return (
    <UserListStack.Navigator>
      <UserListStack.Screen name="UserList" component={UserList} />
      <UserListStack.Screen name="UserInfo" component={UserInfo} />
      <UserListStack.Screen name="UserForm" component={UserForm} />
    </UserListStack.Navigator>
  );
};
const NavgationWrapper = () => {
  const loggedInAs = useSelector((state: any) => state.auth.loggedInAs);
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="UserListStack" component={UserListStackScreen} />
        <Tab.Screen
          name="UserForm"
          component={UserForm}
          options={{ headerShown: true }}
        />
        {loggedInAs && (
          <Tab.Screen
            name="UserInfo"
            component={UserInfo}
            options={{
              title: `${loggedInAs.firstName} ${loggedInAs.lastName}`
            }}
          />
        )}
        <Tab.Screen
          name="PostForm"
          component={PostForm}
          options={{ headerShown: true }}
        />
        <Tab.Screen
          name="PostList"
          component={PostList}
          options={{ headerShown: true }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <ToastProvider>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <NavgationWrapper></NavgationWrapper>
        </PersistGate>
      </Provider>
    </ToastProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
});
