import React, { useState, createRef } from 'react';
import { StyleSheet, TextInput, View, Text, ScrollView, Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';
import DeviceInfo from "react-native-device-info";
import {NetworkInfo} from 'react-native-network-info';

const deviceID = DeviceInfo.getDeviceId();

const LoginScreen = ({ navigation }) => {

  const [userEmail, setUserEmail] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errortext, setErrortext] = useState('');
  const [userIpAddress, setUserIpAddress] = useState('');

  const passwordInputRef = createRef();

  NetworkInfo.getIPAddress().then(ipAddress => {
    setUserIpAddress(ipAddress)
  });

  const handleSubmitPress = () => {
    setErrortext('');
    if (!userEmail) {
      alert('Please fill Email');
      return;
    }
    if (!userPassword) {
      alert('Please fill Password');
      return;
    }
    setLoading(true);
    let dataToSend = {
      ip_address: userIpAddress,
      device_id: deviceID,
      email: userEmail,
      password: userPassword
    };
    let formBody = [];
    for (let key in dataToSend) {
      let encodedKey = encodeURIComponent(key);
      let encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=seller-signin', {
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
      .then((response) => response.json())
      .then((responseJson) => {
        setLoading(false);
        console.log(responseJson);
        if (responseJson.error == 0) {
          AsyncStorage.setItem('user_id',responseJson.seller_info.user_id);
          AsyncStorage.setItem('saved_hash_id',responseJson.seller_info.hash);
          AsyncStorage.setItem('saved_business_category',responseJson.seller_info.business_category);
          
          var loginid = '';
          loginid = JSON.stringify(responseJson.seller_info.login_id)
          AsyncStorage.setItem('saved_login_id',loginid);

          navigation.replace('DrawerNavigationRoutes');
        } else {
          setErrortext('Please check your email id or password');
          console.log('Please check your email id or password');
        }
      })
      .catch((error) => {
        setLoading(false);
        console.error(error);
      });
  };

  return (
    <View style={styles.mainBody}>
      <Loader loading={loading} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignContent: 'center', }}>
        <View>
          <KeyboardAvoidingView enabled>
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../Image/headerlogo.png')}
                style={{ width: '50%', height: 100, resizeMode: 'contain', }} />
            </View>
            <View style={styles.SectionStyle}>
              <TextInput
                style={styles.inputStyle}
                onChangeText={(UserEmail) => setUserEmail(UserEmail)}
                placeholder="Enter Email Address..."
                placeholderTextColor="gray"
                autoCapitalize="none"
                keyboardType="email-address"
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
                onChangeText={
                  (UserPassword) => setUserPassword(UserPassword)
                }
                placeholder="Password"
                placeholderTextColor="gray"
                keyboardType="default"
                ref={passwordInputRef}
                onSubmitEditing={Keyboard.dismiss}
                blurOnSubmit={false}
                secureTextEntry={true}
                returnKeyType="next"
              />
            </View>
            {errortext != '' ? (
              <Text style={styles.errorTextStyle}>
                {errortext}
              </Text>
            ) : null}
            <TouchableOpacity
              style={styles.buttonStyle}
              activeOpacity={0.5}
              onPress={handleSubmitPress}>
              <Text style={styles.buttonTextStyle}>
                LOGIN
              </Text>
            </TouchableOpacity>

            <View style={styles.blackDivider}></View>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.registerTextStyle}>
                Forget Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={styles.registerTextStyle}>
              Creat an Account!
            </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </View>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  mainBody: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'white',
    alignContent: 'center',
  },
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
    marginTop: 15,
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
  blackDivider: {
    marginLeft: 35,
    marginRight: 35,
    height: 1,
    marginTop: 30,
    marginBottom: 10,
    backgroundColor: "#909A95"
  },
  registerTextStyle: {
    color: '#4e73df',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 14,
    marginTop: 10,
    alignSelf: 'center',
  },
  errorTextStyle: {
    color: 'red',
    textAlign: 'center',
    fontSize: 14,
  },
});