import {
  Text,
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { Input, Button } from '@rneui/base';
import { useCreateUserMutation } from '../../store/api/usersApi';
import React, { useRef } from 'react';
import { useToast } from 'react-native-toast-notifications';

export const UserForm = (props) => {
  const { navigation } = props;
  const [createUser, { isLoading, isError, error }] = useCreateUserMutation();
  const [firstName, setFirstName] = React.useState('');
  const [lastName, setLastName] = React.useState('');
  const [statusMessage, setStatusMessage] = React.useState('');
  const [showStatus, setShowStatus] = React.useState(true);
  const toast = useToast();
  const lastNameRef = useRef(null);

  const handleSubmit = async () => {
    try {
      if (firstName && lastName) {
        await createUser({ user: { firstName, lastName } });
        toast.show('User created successfully!', {
          type: 'success',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in'
        });
        setStatusMessage('User created successfully!');
        setFirstName('');
        setLastName('');
        navigation.navigate('UserList');
      } else {
        setStatusMessage('Please fill in both fields!');
        toast.show('Please fill in both fields!', {
          type: 'warning',
          placement: 'top',
          duration: 3000,
          animationType: 'slide-in'
        });
      }
      setShowStatus(true); // Make sure the message is visible
      setTimeout(() => {
        setShowStatus(false); // Hide the message after 3 seconds
      }, 3000);
    } catch (err) {
      console.log('There was an error posting the user data: ', err);
      setStatusMessage('Error creating user!');
      toast.show('Error creating user!', {
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
