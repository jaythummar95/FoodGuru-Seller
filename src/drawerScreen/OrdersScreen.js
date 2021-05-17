import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Loader from '../components/Loader';
import DeviceInfo from "react-native-device-info";
import { NetworkInfo } from 'react-native-network-info';
import { Alert } from 'react-native';

const deviceID = DeviceInfo.getDeviceId();

export default class OrderScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ipAddress: '',
      loadings: false,
      hash: '',
      loginId: '',
      business_category: '',
      sellerId: '',
      order: [],
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
        this.setState({ sellerId: user_id }, () => {
          this.orderData();
        })
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
      limit: '9',
    };

    console.log(dataToSend)
    var formBody = [];
    for (var key in dataToSend) {
      var encodedKey = encodeURIComponent(key);
      var encodedValue = encodeURIComponent(dataToSend[key]);
      formBody.push(encodedKey + '=' + encodedValue);
    }
    formBody = formBody.join('&');

    fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=get-seller-restaurant-orders', {
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
          this.setState({ order: responseJson.orders });

        } else {
          console.log('==== not get order.', responseJson);
        }
      })
      .catch(error => {
        this.setState({ loadings: false })
        console.log('not fatch Get Order Details API');
      });
  }

  deleteOrder(orderid) {
    this.setState({ loadings: true })
    var dataToSend = {
      device_id: deviceID,
      ip_address: this.state.ipAddress,
      login_id: this.state.loginId,
      hash: this.state.hash,
      seller_id: this.state.sellerId,
      type: 'or',
      object_id: orderid
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
          console.log('==== not Delete.');
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
        <Loader loading={this.state.loadings} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginLeft: 10, marginRight: 10 }}>

          <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.mainMenuText}>Sr.</Text>
          </View>

          <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.mainMenuText}>Order Id</Text>
          </View>

          <View style={{ width: '22%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.mainMenuText}>Payment</Text>
          </View>

          <View style={{ width: '28%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.mainMenuText}>Order Date</Text>
          </View>

          <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.mainMenuText}>Actions</Text>
          </View>


        </View>

        <View style={styles.blackDivider}></View>

        <FlatList
          extraData={this.state}
          data={this.state.order}
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
      </View>
    );
  }


  renderItem = ({ item, index }) => {
    const { navigate } = this.props.navigation;
    // var sir = +1
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', marginTop: 10, marginLeft: 10, marginRight: 10 }}>

          <View style={{ width: '10%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>{item.index}</Text>
          </View>

          <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>{item.order_no}</Text>
          </View>

          <View style={{ width: '22%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>{item.payment_type}</Text>
          </View>

          <View style={{ width: '28%', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 16 }}>{item.added_dt}</Text>
          </View>

          <View style={{ width: '20%', alignItems: 'center', justifyContent: 'center' }}>

            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OrderDetail', { orderId: item.order_id })}>
                <Image source={require('../../Image/detail.png')}
                  style={{ width: 25, height: 25, resizeMode: 'contain', marginRight: 10 }} />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => {
                Alert.alert('', 'Are you sure you want to delete?', [
                  {
                    text: 'No',
                    style: 'cancel',
                    onPress: () => {

                    }
                  },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      this.deleteOrder(item.order_id)
                    }
                  }
                ])
              }}>
                <Text style={{ fontSize: 17 }}>X</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.grayDivider}></View>
      </View>
    );
  }

  keyExtractor = (item, index) => {
    return index.toString();
  }
};

const styles = StyleSheet.create({
  mainMenuText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'gray'
  },
  blackDivider: {
    marginLeft: 5,
    marginRight: 5,
    height: 2,
    marginTop: 5,
    backgroundColor: "black"
  },
  grayDivider: {
    marginLeft: 5,
    marginRight: 5,
    height: 1,
    marginTop: 5,
    backgroundColor: "#909A95"
  },
});