import React from 'react';
import { View, Text, Alert, TouchableOpacity, Keyboard, TextInput, Image, StyleSheet, FlatList } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { NetworkInfo } from 'react-native-network-info';
import DeviceInfo from "react-native-device-info";
import CheckBox from '@react-native-community/checkbox';
import DocumentPicker from 'react-native-document-picker';
import { ScrollView } from 'react-native-gesture-handler';
import Loader from '../components/Loader';

const deviceID = DeviceInfo.getDeviceId();

export default class AddMenu extends React.Component {

    constructor(props) {
        super(props);
        this.state = { selectedButton: null };
        this.selectionOnPress = this.selectionOnPress.bind(this);
        this.state = {
            loadings: false,
            hash: '',
            loginId: '',
            sellerId: '',
            ipAddress: '',
            items: [],
            searchName: '',
            selectedCategoryId: '',
            checked: false,
            singleFile: '',
            itemName: '',
            itemDescription: '',
            itemPrice: '',
            foodType: '',
            featured: '',
            menu: [],
            categoryId: '',
        };
    }

    selectionOnPress(userType, foodType) {
        this.setState({ selectedButton: userType });
        this.setState({ foodType: foodType })
    }

    async componentDidMount() {

        NetworkInfo.getIPAddress().then(ipAddress => {
            this.setState({ ipAddress: ipAddress })
        });

        AsyncStorage.getItem("saved_hash_id").then((saved_hash_id) => {
            if (saved_hash_id) {
                this.setState({ hash: saved_hash_id })
            }
        });
        AsyncStorage.getItem("saved_business_category").then((saved_business_category) => {
            if (saved_business_category) {
                this.setState({ business_category: saved_business_category })
            }
        });
        AsyncStorage.getItem("saved_login_id").then((saved_login_id) => {
            if (saved_login_id) {
                this.setState({ loginId: saved_login_id })
            }
        });
        AsyncStorage.getItem("user_id").then((user_id) => {
            if (user_id) {
                this.setState({ sellerId: user_id })
                this.orderData();
            }
        });
    }


    async orderData() {
        var dataToSend = {
            device_id: deviceID,
            ip_address: this.state.ipAddress,
            login_id: this.state.loginId,
            hash: this.state.hash,
            seller_id: this.state.sellerId,
            page: '1',
            limit: '9',
        };

        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=get-menu-categories', {
            method: 'POST',
            body: formBody,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => response.json())
            .then(responseJson => {
                // this.setState({ loadings: false })
                if (responseJson.error == 0) {
                    for (let i = 0; i < responseJson.categories.length; i++) {
                        this.controller.addItem({
                            label: responseJson.categories[i].category_name,
                            value: responseJson.categories[i].category_id,
                            icon: () => { },
                        });
                    }
                } else {
                    console.log('==== not get order.', responseJson.error);
                }
            })
            .catch(error => {
                // setLoading(false);
                console.log('not fatch Get Order Details API');
            });
    }

    menuItem(value) {
        var dataToSend = {
            device_id: deviceID,
            ip_address: this.state.ipAddress,
            login_id: this.state.loginId,
            hash: this.state.hash,
            seller_id: this.state.sellerId,
            category_id: value,
            page: '1',
            limit: '20'
        };

        this.setState({ categoryId: value })
        console.log("///////////////////", this.state.categoryId)

        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        console.log(formBody)

        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=get-menu-by-category', {
            method: 'POST',
            body: formBody,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        })
            .then(response => response.json())
            .then(responseJson => {
                if (responseJson.error == 0) {
                    console.log('done Menu category', responseJson.menus);
                    this.setState({ menu: responseJson.menus })
                    console.log('......', this.state.menu)
                } else {
                    console.log('not get menu category.', responseJson.error);
                }
            })
            .catch(error => {
                console.log('not fatch menu category API');
            });
    }

    saveData(categoryId) {

        if (categoryId == '') {
            Alert.alert('', 'Please select category')
            return
        }
        else if (this.state.itemName == '') {
            Alert.alert('', 'Please enter item name')
            return
        }
        else if (this.state.itemDescription == '') {
            Alert.alert('', 'Please enter item description')
            return
        }
        else if (this.state.itemPrice == '') {
            Alert.alert('', 'Please enter item price')
            return
        }

        var dataToSend = {
            device_id: deviceID,
            ip_address: this.state.ipAddress,
            login_id: this.state.loginId,
            hash: this.state.hash,
            seller_id: this.state.sellerId,
            category_id: categoryId,
            "item_name[0]": this.state.itemName,
            "item_description[0]": this.state.itemDescription,
            "item_price[0]": this.state.itemPrice,
            "food_type[0]": this.state.foodType,
            "featured[0]": this.state.featured,
            // item_image: this.state.singleFile
        };


        var formBody = [];
        var formData = new FormData()
        for (var key in dataToSend) {
            var encodedKey = key;
            var encodedValue = encodeURIComponent(dataToSend[key]);
            // formBody.push(encodedKey + '=' + encodedValue);
            formData.append(encodedKey, encodedValue);
        }

        formData.append('item_image[0]', [{
            uri: this.state.singleFile.fileCopyUri,
            type: 'image/jpeg', // or photo.type
            name: this.state.singleFile.name
        }]);

        console.log(formData)
        // formBody = formBody.join('&');

        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=add-menu-category-wise', {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => response.json())
            .then(responseJson => {
                this.setState({ loadings: false })
                if (responseJson.error == 0) {
                    this.setState({
                        searchName: '',
                        checked: false,
                        singleFile: '',
                        itemName: '',
                        itemDescription: '',
                        itemPrice: '',
                        foodType: '',
                        featured: '',
                    }, () => {
                        this.menuItem(categoryId)
                    })
                } else {
                    console.log('not add menu.', responseJson.error);
                }
            })
            .catch(error => {
                // setLoading(false);
                this.setState({ loadings: false })
                console.log('not fatch add menu API');
            });
    }

    renderItem = ({ item, index }) => {

        return (
            <View style={{ flex: 1, backgroundColor: 'white', marginTop: 5 }}>
                <View style={styles.container}>

                    <Image style={styles.imageStyle} source={{ uri: item.item_image }}></Image>

                    <View style={{ marginStart: 10, marginEnd: 20, flex: 1, justifyContent: 'flex-start' }}>

                        <Text numberOfLines={2}
                            ellipsizeMode={"tail"}
                            style={styles.restaurantText}>{item.item_name}
                        </Text>

                        <Text numberOfLines={3}
                            ellipsizeMode={"tail"}
                            style={styles.addressText}>{item.item_description}
                        </Text>

                        <View style={{ marginTop: 5 }}>
                            <Text
                                ellipsizeMode={"tail"}
                                style={styles.datetimeText}>₹ {item.item_price}
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    keyExtractor = (item, index) => {
        return index.toString();
    }

    onChangeCheck(value) {
        this.setState({ checked: !this.state.checked })
        this.setState({ featured: value })

    }

    async selectFile() {
        //Opening Document Picker to select one file
        try {
            const res = await DocumentPicker.pick({
                //Provide which type of file you want user to pick
                type: [DocumentPicker.types.images],
                //There can me more options as well
                // DocumentPicker.types.allFiles
                // DocumentPicker.types.images
                // DocumentPicker.types.plainText
                // DocumentPicker.types.audio
                // DocumentPicker.types.pdf
            });
            //Printing the log realted to the file
            console.log('res : ' + JSON.stringify(res));
            //Setting the state to show single file attributes
            this.setState({ singleFile: res })
            // setSingleFile(res);
        } catch (err) {
            this.setState({ singleFile: '' })
            // setSingleFile(null);
            //Handling any exception (If any)
            if (DocumentPicker.isCancel(err)) {
                //If user canceled the document selection
            } else {
                alert('Unknown Error: ' + JSON.stringify(err));
                throw err;
            }
        }
    };

    changeStatus(categoryId) {
        // this.saveData(categoryId)
    }

    render() {
        return (
            <View style={{ flex: 1 }}>
                <Loader loading={this.state.loadings} />
                <ScrollView>
                    <View style={{ backgroundColor: 'white', margin: 10 }}>
                        <View style={{ marginTop: 10, zIndex: 1000 }}>
                            <DropDownPicker
                                items={this.state.items}
                                controller={instance => this.controller = instance}
                                defaultValue={this.state.selectedCategoryId}
                                placeholder='Select Menu Category'
                                placeholderStyle={{ color: 'gray' }}
                                containerStyle={{ height: 40 }}
                                style={{ backgroundColor: 'white', marginStart: 10, marginEnd: 10, borderColor: '#224abe' }}
                                itemStyle={{ justifyContent: 'flex-start' }}
                                dropDownStyle={{ backgroundColor: '#fafafa', borderColor: 'gray' }}

                                onChangeList={(items, callback) => {
                                    this.setState({
                                        items // items: items
                                    }, callback);
                                }}
                                onChangeItem={item => this.menuItem(item.value)}
                            />
                        </View>
                        <View style={{ margin: 10 }}>
                            <View style={[styles.SectionStyle, { height: 35, borderColor: '#474747', borderBottomWidth: 1 }]}>
                                <TextInput
                                    style={[styles.inputStyle, { height: 35 }]}
                                    onChangeText={(itemName) => this.setState({ itemName })}
                                    placeholder="Enter Food Name"
                                    underlineColorAndroid='black'
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    keyboardType="default"
                                    returnKeyType="next"
                                    value={this.state.itemName}
                                    onSubmitEditing={Keyboard.dismiss}
                                    blurOnSubmit={false}
                                />
                            </View>
                            <View style={[styles.SectionStyle, { height: 80, borderColor: '#474747', borderBottomWidth: 1, marginTop: 15 }]}>
                                <TextInput
                                    style={[styles.inputStyle, { height: 80 }]}
                                    onChangeText={(itemDescription) => this.setState({ itemDescription })}
                                    placeholder="Enter Food Description"
                                    underlineColorAndroid='black'
                                    placeholderTextColor="gray"
                                    autoCapitalize="none"
                                    multiline
                                    numberOfLines={4}
                                    keyboardType="default"
                                    returnKeyType="next"
                                    value={this.state.itemDescription}
                                    onSubmitEditing={Keyboard.dismiss}
                                    blurOnSubmit={false}
                                    multiline={true}
                                />
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 15 }}>
                                <View style={{ width: '45%', marginTop: 0, height: 40, borderColor: '#474747', borderBottomWidth: 1, marginRight: 15 }}>
                                    <TextInput
                                        style={[styles.inputStyle, { height: 35 }]}
                                        onChangeText={(itemPrice) => this.setState({ itemPrice })}
                                        placeholder="Enter Price"
                                        underlineColorAndroid='black'
                                        placeholderTextColor="gray"
                                        autoCapitalize="none"
                                        keyboardType="default"
                                        returnKeyType="next"
                                        value={this.state.itemPrice}
                                        onSubmitEditing={Keyboard.dismiss}
                                        blurOnSubmit={false}
                                    />
                                </View>
                                <TouchableOpacity
                                    style={{
                                        height: 40,
                                        width: 90,
                                        backgroundColor: this.state.selectedButton === "BASIC" ? "#18aa75" : "grey",
                                        borderRadius: 5,
                                        padding: 10,
                                        elevation: 2,
                                        marginLeft: 5
                                    }}
                                    onPress={() => this.selectionOnPress("BASIC", '1')}>
                                    <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Veg</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{
                                        height: 40,
                                        width: 90,
                                        backgroundColor: this.state.selectedButton === "INTERMEDIATE" ? "#ef210d" : "grey",
                                        borderRadius: 5,
                                        padding: 10,
                                        elevation: 2,
                                        marginLeft: 5,
                                    }}
                                    onPress={() => this.selectionOnPress("INTERMEDIATE")}>
                                    <Text style={{ fontSize: 15, color: 'white', fontWeight: 'bold' }}>Non-Veg</Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{ flexDirection: 'row', marginTop: 25 }}>
                                <CheckBox
                                    style={{ height: 20 }}
                                    value={this.state.checked}
                                    onValueChange={() => this.onChangeCheck('1')} />
                                <Text style={{ fontSize: 16, color: 'gray', alignSelf: 'center' }}>Featured</Text>
                            </View>



                            <View style={{ width: '100%', marginTop: 15, alignItems: 'center', }}>
                                <TouchableOpacity
                                    style={styles.imagePickerButton}
                                    activeOpacity={0.5}
                                    onPress={this.selectFile.bind(this)}>
                                    <Text style={styles.imagePickerText}>Select File </Text>
                                </TouchableOpacity>
                            </View>

                            {/*Showing the data of selected Single file*/}
                            {this.state.singleFile != null ? (
                                <Text style={styles.fileTextStyle}>
                                    {this.state.singleFile.name ? this.state.singleFile.name : ''}
                                    {'\n'}
                                    {/* Type: {this.state.singleFile.type ? this.state.singleFile.type : ''} */}
                                    {'\n'}
                                    {/* File Size: {singleFile.size ? singleFile.size : ''}
                            {'\n'}
                            URI: {singleFile.uri ? singleFile.uri : ''}
                            {'\n'} */}
                                </Text>
                            ) : null}


                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    style={styles.saveButtonStyle}
                                    onPress={() => {
                                        this.setState({
                                            loadings: true
                                        }, () => {
                                            this.saveData(this.state.categoryId)
                                        })
                                    }}
                                    activeOpacity={0.5}>
                                    <Text style={styles.saveButtonTextStyle}>Save</Text>
                                </TouchableOpacity>
                            </View>

                        </View>
                    </View>

                    <View style={{ backgroundColor: 'white', margin: 10 }}>
                        <View style={{ height: 40, width: '100%' }}>
                            <Text style={{ color: 'blue', fontSize: 15, margin: 7 }}>Recently Added Foods</Text>
                            <View style={styles.blackDivider}></View>
                        </View>

                    </View>
                    <View style={{ flex: 1 }}>
                        <FlatList
                            extraData={this.state}
                            data={this.state.menu}
                            keyExtractor={this.keyExtractor}
                            renderItem={this.renderItem}
                        />
                    </View>
                </ScrollView>
            </View>
        )
    }
}

const styles = StyleSheet.create({

    SectionStyle: {
        width: '100%',
        marginTop: 5,
    },
    blackDivider: {
        height: 1,
        backgroundColor: "gray"
    },
    inputStyle: {
        color: 'black',
        fontSize: 15
    },
    saveButtonStyle: {
        width: '20%',
        backgroundColor: '#4e73df',
        height: 38,
        alignItems: 'center',
        marginBottom: 10,
        marginTop: -20,
        justifyContent: 'center',
        borderRadius: 15,
        marginRight: 5,
    },
    saveButtonTextStyle: {
        color: 'white',
        fontSize: 15,
        fontWeight: 'bold'
    },
    fileTextStyle: {
        alignItems: 'center',
        textAlign: 'center',
        color: 'gray',
        justifyContent: 'center',
        marginTop: 15
    },
    imagePickerButton: {
        width: '80%',
        backgroundColor: '#0091EA',
        borderRadius: 15,
    },
    imagePickerText: {
        color: '#fff',
        fontSize: 14,
        padding: 10,
        textAlign: 'center'
    },







    container: {
        height: 120,
        flex: 1,
        flexDirection: "row",
        marginStart: 5,
        marginBottom: 17,
    },
    imageStyle: {
        width: '35%',
        height: '100%',
        borderRadius: 10
    },
    restaurantText: {
        fontSize: 16,
        marginStart: 5,
        fontWeight: 'bold',
        width: "100%",
        lineHeight: 20,
    },
    addressText: {
        fontSize: 15,
        marginStart: 5,
        fontWeight: Platform.OS == "android" ? "900" : "600",
        width: "100%",
        lineHeight: 20,
    },
    datetimeText: {
        fontSize: 15,
        fontWeight: "bold",
        lineHeight: 20,
        width: "100%",
    },
});