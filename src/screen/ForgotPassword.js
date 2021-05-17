import React, { useState, createRef } from 'react';
import { StyleSheet, TextInput, View, Text, ScrollView, Image, Keyboard, TouchableOpacity, KeyboardAvoidingView, Alert } from 'react-native';
import Loader from '../components/Loader';
import DeviceInfo from "react-native-device-info";

const deviceID = DeviceInfo.getDeviceId();

const ForgotPassword = ({ navigation }) => {

    const [userEmail, setUserEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [errortext, setErrortext] = useState('');


    const handleSubmitPress = () => {
        setErrortext('');
        if (!userEmail) {
            Alert.alert('', 'Please fill Email');
            return;
        }
        setLoading(true);
        
        let dataToSend = {
            ip_address: "1.2.4",
            device_id: deviceID,
            email: userEmail,
        };

        let formBody = [];
        for (let key in dataToSend) {
            let encodedKey = encodeURIComponent(key);
            let encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=seller-forgot-password', {
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
                    alert('Link sent to your email address. Please check your email.')
                    navigation.replace('LoginScreen');

                } else {
                    setErrortext(responseJson.msg);
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
            <View style={{}}>
                <KeyboardAvoidingView enabled>
                    <View style={{ alignItems: 'center', marginTop: 10 }}>
                        <Image
                            source={require('../../Image/headerlogo.png')}
                            style={{ width: '50%', height: 100, resizeMode: 'contain', }} />

                        <Text style={{ fontSize: 19, color: 'black', marginTop: 10 }}>Forget your Password ?</Text>
                        <Text numberOfLines={3} style={{ textAlign: 'center', width: '70%', color: 'gray', marginTop: 10 }}>We get it, stuff happens. Just enter your email address below and we'll send you a link to reset your password!</Text>

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
                            onSubmitEditing={Keyboard.dismiss}
                            blurOnSubmit={false}
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
                            Send Link
                        </Text>
                    </TouchableOpacity>

                    <View style={styles.blackDivider}></View>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('RegisterScreen')}>
                        <Text style={styles.registerTextStyle}>
                            Creat an Account!
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        activeOpacity={0.5}
                        onPress={() => navigation.navigate('LoginScreen')}>
                        <Text style={styles.registerTextStyle}>
                            Already have an Account? Login!
                        </Text>
                    </TouchableOpacity>

                </KeyboardAvoidingView>
            </View>
        </View>
    );
};

export default ForgotPassword;

const styles = StyleSheet.create({
    mainBody: {
        flex: 1,
        //   justifyContent: 'center',
        backgroundColor: 'white',
        //   alignContent: 'center',
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