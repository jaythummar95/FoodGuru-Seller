import React, { useState, createRef } from 'react';
import { StyleSheet, TextInput, View, Text, Image, KeyboardAvoidingView, Keyboard, TouchableOpacity, ScrollView, Alert } from 'react-native';
import DeviceInfo from "react-native-device-info";
import DropDownPicker from 'react-native-dropdown-picker';
import Loader from '../components/Loader';
import { NetworkInfo } from 'react-native-network-info';

const deviceID = DeviceInfo.getDeviceId();

const RegisterScreen = (props) => {

  let [firstName, setFirstName] = useState('');
  let [lastName, setLastName] = useState('');
  let [userEmail, setUserEmail] = useState('');
  let [userMobile, setUserMobile] = useState('');
  let [userPassword, setUserPassword] = useState('');
  let [userRepeatPassword, setUserRepeatPassword] = useState('');
  let [userBusinessCategory, setUserBusinessCategory] = useState('');
  let [loading, setLoading] = useState(false);
  let [errortext, setErrortext] = useState('');
  let [isRegistraionSuccess, setIsRegistraionSuccess] = useState(false);
  const [userIpAddress, setUserIpAddress] = useState('');


  const lastNameInputRef = createRef();
  const emailInputRef = createRef();
  const mobileInputRef = createRef();
  const passwordInputRef = createRef();
  const rePasswordInputRef = createRef();

  NetworkInfo.getIPAddress().then(ipAddress => {
    setUserIpAddress(ipAddress)
  });

  const handleSubmitButton = () => {
    setErrortext('');
    if (!firstName) {
      Alert.alert('', 'Please fill First Name');
      return;
    }
    if (!lastName) {
      Alert.alert('', 'Please fill Last Name');
      return;
    }
    if (!userEmail) {
      Alert.alert('', 'Please fill Email');
      return;
    }
    if (!userMobile) {
      Alert.alert('', 'Please fill Contact No.');
      return;
    }
    if (!userPassword) {
      Alert.alert('', 'Please fill your Password');
      return;
    }
    if (!userRepeatPassword) {
      Alert.alert('', 'Please Enter agin Password');
      return;
    }
    if (!userBusinessCategory) {
      Alert.alert('', 'Please Select Business Category');
      return;
    }
    //Show Loader
    setLoading(true);

    var dataToSend = {
      device_id: deviceID,
      ip_address: userIpAddress,
      email: userEmail,
      first_name: firstName,
      last_name: lastName,
      mobile: userMobile,
      password: userPassword,
      confirm_password: userRepeatPassword,
      business_category: userBusinessCategory
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=seller-signup', {
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then(response => response.json())
      .then(responseJson => {
        setLoading(false);
        if (responseJson.error == 0) {
          setIsRegistraionSuccess(true);
          console.log('Registration Successful. Please Login to proceed');

        } else {
          setErrortext(responseJson.msg);
          console.log(responseJson.msg)
        }
      })
      .catch(error => {
        setLoading(false);
        console.error(error);
      });
  };
  if (isRegistraionSuccess) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'white',
          justifyContent: 'center',
        }}>
        <Image
          source={require('../../Image/success.png')}
          style={{
            height: 150,
            resizeMode: 'contain',
            alignSelf: 'center'
          }}
        />
        <Text style={styles.successTextStyle}>
          Registration Successful
        </Text>
        <TouchableOpacity
          style={styles.buttonStyle}
          activeOpacity={0.5}
          onPress={() => props.navigation.navigate('LoginScreen')}>
          <Text style={styles.buttonTextStyle}>Login Now</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ justifyContent: 'center', alignContent: 'center', }}>
        <KeyboardAvoidingView enabled>
          <View style={{ marginTop: 20, zIndex: 100 }}>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={FirstName => setFirstName(FirstName)}
                placeholder="First Name"
                placeholderTextColor="gray"
                autoCapitalize="sentences"
                returnKeyType="next"
                onSubmitEditing={() =>
                  lastNameInputRef.current &&
                  lastNameInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={LastName => setLastName(LastName)}
                underlineColorAndroid="#f000"
                placeholder="Last Name"
                placeholderTextColor="gray"
                autoCapitalize="sentences"
                keyboardType="default"
                ref={lastNameInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  emailInputRef.current &&
                  emailInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserEmail => setUserEmail(UserEmail)}
                placeholder="Enter Email"
                placeholderTextColor="gray"
                keyboardType="email-address"
                ref={emailInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  mobileInputRef.current &&
                  mobileInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserMobile => setUserMobile(UserMobile)}
                placeholder="Contact No"
                placeholderTextColor="gray"
                keyboardType="numeric"
                ref={mobileInputRef}
                returnKeyType="next"
                onSubmitEditing={() =>
                  passwordInputRef.current &&
                  passwordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserPassword => setUserPassword(UserPassword)}
                placeholder="Password"
                placeholderTextColor="gray"
                ref={passwordInputRef}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={() =>
                  rePasswordInputRef.current &&
                  rePasswordInputRef.current.focus()
                }
                blurOnSubmit={false}
              />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={UserRepeatPassword => setUserRepeatPassword(UserRepeatPassword)}
                placeholder="Repeat Password"
                placeholderTextColor="gray"
                ref={rePasswordInputRef}
                secureTextEntry={true}
                returnKeyType="next"
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
              />
            </View>
            <View style={{ marginTop: 10, marginLeft: 25, marginRight: 25, zIndex: 1000 }}>
              <DropDownPicker
                items={[
                  { label: 'Grocery', value: '2', hidden: true },
                  { label: 'Restaurants', value: '5' },
                ]}
                defaultValue={userBusinessCategory}
                placeholder='Select Business Category'
                containerStyle={{ height: 40 }}
                style={{ backgroundColor: 'white', marginStart: 10, marginEnd: 10, borderColor: '#224abe', zIndex: 1000 }}
                itemStyle={{ justifyContent: 'flex-start' }}
                dropDownStyle={{ backgroundColor: '#fafafa', borderColor: 'gray' }}
                onChangeItem={items => setUserBusinessCategory(items.value)}
              />
            </View>
          </View>
          {errortext != '' ? (
            <Text style={styles.errorTextStyle}>
              {errortext}
            </Text>
          ) : null}
          <TouchableOpacity
            style={styles.buttonStyle}
            activeOpacity={0.5}
            onPress={handleSubmitButton}>
            <Text style={styles.buttonTextStyle}>
              REGISTER
            </Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </View>
  );
};
export default RegisterScreen;

const styles = StyleSheet.create({
  SectionStyle: {
    flexDirection: 'row',
    height: 40,
    marginTop: 15,
    marginLeft: 35,
    marginRight: 35,
    margin: 10,
  },
  buttonStyle: {
    backgroundColor: '#4e73df',
    borderWidth: 0,
    color: '#FFFFFF',
    borderColor: '#7DE24E',
    height: 40,
    alignItems: 'center',
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 25,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: '#FFFFFF',
    paddingVertical: 10,
    fontSize: 16,
  },
  inputStyle: {
    flex: 1,
    color: 'black',
    paddingLeft: 15,
    paddingRight: 15,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#224abe',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 20,
    marginHorizontal: 20
  },
  successTextStyle: {
    color: 'black',
    textAlign: 'center',
    fontSize: 18,
    padding: 30,
  },
});