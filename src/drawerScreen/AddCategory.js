import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Keyboard, TextInput, Image, StyleSheet, FlatList, Alert, Dimensions } from 'react-native';
import { Card } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';
import DeviceInfo from "react-native-device-info";
import { NetworkInfo } from 'react-native-network-info';

const deviceID = DeviceInfo.getDeviceId();

export default class AddCategory extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      loadings: false,
      hash: '',
      loginId: '',
      sellerId: '',
      ipAddress: '',
      categoriesName: [],
      searchName: '',
      selectedCategoryId: ''
    };
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

    this.setState({ loadings: true })
    var dataToSend = {
      device_id: deviceID,
      ip_address: this.state.ipAddress,
      login_id: this.state.loginId,
      hash: this.state.hash,
      seller_id: this.state.sellerId,
      page: '1',
      limit: '9'
    };

    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    console.log(dataToSend)
    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=get-menu-categories', {
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
      .then(responseJson => {
        this.setState({ loadings: false })
        if (responseJson.error == 0) {

          this.setState({ categoriesName: responseJson.categories });

        } else {
          console.log('==== not get order.', responseJson.error);
        }
      })
      .catch(error => {
        // setLoading(false);
        console.log('not fatch Get Order Details API');
      });
  }

  saveMenuName() {

    var dataToSend = {
      device_id: deviceID,
      ip_address: this.state.ipAddress,
      login_id: this.state.loginId,
      hash: this.state.hash,
      seller_id: this.state.sellerId,
      category_id: this.state.selectedCategoryId,
      menu_name: this.state.searchName,
    };

    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=add-menu-category', {
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
      .then(responseJson => {
        this.setState({ loadings: false })
        console.log(responseJson)
        if (responseJson.error == 0) {

          this.setState({ searchName: '' });
          this.orderData();

        } else {
          console.log('==== not get order.', responseJson.error);
        }
      })
      .catch(error => {
        console.log('not fatch Get Order Details API');
      });
  }

  editMenuName(categoryId, categoryName) {
    this.setState({ searchName: categoryName });
    this.setState({ selectedCategoryId: categoryId });
  }

  deleteMenuName(categoryId) {
    var dataToSend = {
      device_id: deviceID,
      ip_address: this.state.ipAddress,
      login_id: this.state.loginId,
      hash: this.state.hash,
      seller_id: this.state.sellerId,
      type: 'c',
      object_id: categoryId
    };
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=delete', {
      method: 'POST',
      body: formBody,
      headers: {
        'Accept': "application/json",
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }).then(response => response.json())
      .then(responseJson => {
        this.setState({ loadings: false })
        if (responseJson.error == 0) {
          this.orderData()
        } else {
          console.log('==== not Delete.', responseJson);
        }
      })
      .catch(error => {
        this.setState({ loadings: false })
        console.log('not fatch Delete API');
      });
  }


  render() {
    const { order } = this.state
    return (
      <View style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row' }}>
          <View style={styles.SectionStyle}>
            <TextInput
              style={styles.inputStyle}
              onChangeText={(searchName) => this.setState({ searchName })}
              defaultValue={this.state.searchName}
              placeholder="Enter Menu.. E.g. Punjabi, Gujrati, Chinese "
              placeholderTextColor="gray"
              autoCapitalize="none"
              keyboardType="default"
              returnKeyType="next"
              onSubmitEditing={Keyboard.dismiss}
              blurOnSubmit={false}
            />
          </View>
          <TouchableOpacity
            style={styles.buttonStyle}
            onPress={() => this.saveMenuName()}
            activeOpacity={0.5}>
            <Text style={styles.saveButtonTextStyle}>Save</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderRadius: 5, marginBottom: 10, paddingLeft: 10, paddingTop: 7, marginTop: 15, marginLeft: 10, marginRight: 10, height: 40, backgroundColor: '#EEF4F1' }}>
          <Text style={{ color: 'blue', fontSize: 16, fontWeight: 'bold' }}>Recently Added Category</Text>
        </View>
        <View style={{ flex: 1 }}>
          <FlatList
            extraData={this.state}
            data={this.state.categoriesName}
            keyExtractor={this.keyExtractor}
            renderItem={this.renderItem}
            numColumns={2}
          />
        </View>
      </View>
    );
  }

  renderItem = ({ item, index }) => {
    return (
      <View style={styles.cellContainer}>
        {/*Card to show the Gift*/}
        <View style={styles.cardStyle}>

          <Text style={styles.headingStyle}>
            {item.category_name}
          </Text>

          <Text style={{ color: 'blue', fontSize: 14, marginVertical: 5 }}>Items: {item.no_of_items}</Text>

          <Text style={styles.textLargeStyle}>
            {item.dt}
          </Text>

          <View style={styles.simpleLineStyle} />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                Alert.alert('', 'Are you sure you want to delete this menu?', [
                  {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => { }
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      this.deleteMenuName(item.category_id)
                    }
                  }
                ])
              }}
              activeOpacity={0.5}>
              <Text style={styles.buttonTextStyle}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.editButton}
              onPress={() => this.editMenuName(item.category_id, item.category_name)}
              activeOpacity={0.5}>
              <Text style={styles.buttonTextStyle}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  keyExtractor = (item, index) => {
    return index.toString();
  }
};

const styles = StyleSheet.create({
  SectionStyle: {
    width: '75%',
    height: 40,
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
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
  buttonStyle: {
    width: '17%',
    backgroundColor: '#4e73df',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    marginRight: 5,
    marginTop: 15,
  },
  saveButtonTextStyle: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold'
  },
  buttonTextStyle: {
    color: '#307ecc',
    fontSize: 15,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 3,
    backgroundColor: '#ecf0f1',
    padding: 3,
  },
  cellContainer: {
    width: Dimensions.get('window').width / 2,
    justifyContent: 'center',
    paddingTop: 3,
    backgroundColor: '#ecf0f1',
    padding: 3,
  },
  cardStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: 'white',
  },
  textLargeStyle: {
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
  },
  simpleLineStyle: {
    backgroundColor: 'grey',
    width: '100%',
    height: 1,
    marginVertical: 5
  },
  headingStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: 'green',
  },
  paragraph: {
    margin: 5,
    fontSize: 15,
    textAlign: 'center',
  },
  logoStyle: {
    height: 84,
    width: 84,
  },
  deleteButton: {
    backgroundColor: 'transparent',
    height: 30,
    width: '35%',
    borderRadius: 15,
    borderColor: '#307ecc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginStart: 5
  },
  editButton: {
    backgroundColor: 'transparent',
    height: 30,
    width: '35%',
    borderRadius: 15,
    borderColor: '#307ecc',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: '25%',
  },
  buttonContainer: {
    marginTop: 5,
    backgroundColor: 'white',
    width: '100%',
    flexDirection: 'row'
  }

})