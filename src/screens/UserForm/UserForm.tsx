import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Input, Button } from '@rneui/base';
import { useCreateUserMutation } from '../../store/api/usersApi';
import React, { useRef, useState } from 'react';
import { useToast } from 'react-native-toast-notifications';
import { useUpdateUserMutation } from '../../store/api/usersApi';

export const UserForm = ({ route, navigation }) => {
  const [createUser, { isLoading, isError, error }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [firstName, setFirstName] = useState(
    route?.params?.user?.firstName || ''
  );
  const [lastName, setLastName] = useState(route?.params?.user?.lastName || '');
  const [statusMessage, setStatusMessage] = useState('');
  const [showStatus, setShowStatus] = useState(true);
  const toast = useToast();
  const lastNameRef = useRef(null);

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Dismiss the keyboard

    if (!firstName || !lastName) {
      toast.show('Please fill in both fields!', {
        type: 'warning',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in'
      });
      return;
    }

    // Check if we're updating an existing user or creating a new one
    const isUpdatingUser = route?.params?.user;

    try {
      if (isUpdatingUser) {
        // If updating, call the updateUser mutation
        await updateUser({
          userId: route?.params?.user?.id,
          user: { firstName, lastName }
        });
        toast.show('User updated successfully!', {
          type: 'success',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in'
        });
      } else {
        // If creating, call the createUser mutation
        await createUser({ user: { firstName, lastName } });
        toast.show('User created successfully!', {
          type: 'success',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in'
        });
      }
      // Reset form and navigate back
      setFirstName('');
      setLastName('');
      navigation.navigate('UserList');
    } catch (error) {
      console.error('There was an error posting the user data: ', error);
      toast.show(`Error ${isUpdatingUser ? 'updating' : 'creating'} user!`, {
        type: 'error',
        placement: 'top',
        duration: 3000,
        animationType: 'slide-in'
      });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={styles.parentContainer}>
        <View style={styles.container}>
          <Text>UserForm</Text>
          <Input
            returnKeyType="next"
            onSubmitEditing={() => lastNameRef.current.focus()}
            blurOnSubmit={false}
            placeholder="First Name"
            value={firstName}
            disabled={isLoading}
            onChangeText={(text) => setFirstName(text)}
          ></Input>
          <Input
            returnKeyType="send"
            onSubmitEditing={() => handleSubmit()}
            ref={lastNameRef}
            placeholder="Last Name"
            disabled={isLoading}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          ></Input>
          <Button
            disabled={isLoading}
            loading={isLoading}
            title="Create User"
            onPress={() => handleSubmit()}
          >
            Submit
          </Button>
          {showStatus && statusMessage && (
            <Text
              style={
                statusMessage === 'User created successfully!'
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {statusMessage}
            </Text>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1,
    margin: 36,
    backgroundColor: 'white',
    borderColor: '#eee',
    borderWidth: 1,
    borderRadius: 10
  },

  container: {
    backgroundColor: 'white',
    padding: 16
  },

  successMessage: {
    color: 'green',
    marginTop: 10
  },
  errorMessage: {
    color: 'red',
    marginTop: 10
  }
});
