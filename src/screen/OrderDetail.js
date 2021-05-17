import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, FlatList, StyleSheet, Image, ScrollView, Modal, TouchableHighlight } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import { RadioGroup } from 'react-native-btr';
import Loader from '../components/Loader';
import DeviceInfo from "react-native-device-info";
import { NetworkInfo } from 'react-native-network-info';

const deviceID = DeviceInfo.getDeviceId();

export default class OrderDetail extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loadings: false,
            orderId: props.route.params.orderId,
            hash: '',
            loginId: '',
            business_category: '',
            sellerId: '',
            orderNo: '',
            orderDate: '',
            grandTotal: '',
            orderStatus: '',
            orderType: '',
            customerName: '',
            customerEmail: '',
            customerMobile: '',
            paymentType: '',
            restaurantName: '',
            items: [],
            subTotal: '',
            gst: '',
            autoAccept: '',
            ipAddress: '',
            modalVisible: false,
            openModal: false,
            radioButtons: [
                {
                    label: '15 Mini',
                    value: '15',
                    checked: true,
                    color: 'black',
                    disabled: false,
                    flexDirection: 'row',
                    size: 8
                },
                {
                    label: '30 Mini',
                    value: '30',
                    checked: false,
                    color: 'black',
                    disabled: false,
                    flexDirection: 'row',
                    size: 8
                },
                {
                    label: '45 Mini',
                    value: '45',
                    checked: false,
                    color: 'black',
                    disabled: false,
                    flexDirection: 'row',
                    size: 8
                },
                {
                    label: '60 Mini',
                    value: '60',
                    checked: false,
                    color: 'black',
                    disabled: false,
                    flexDirection: 'row',
                    size: 8
                }
            ]
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
                this.orderDetail();
            }
        });
    }

    async orderDetail() {
        this.setState({ loadings: true })
        var dataToSend = {
            device_id: deviceID,
            ip_address: this.state.ipAddress,
            login_id: this.state.loginId,
            hash: this.state.hash,
            seller_type: this.state.business_category,
            seller_id: this.state.sellerId,
            order_id: this.state.orderId,
        };
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');

        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=get-seller-order-details', {
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
                    this.setState({ items: responseJson.order_details.items });
                    this.setState({ autoAccept: responseJson.order_details.auto_accept });
                    this.setState({ orderNo: responseJson.order_details.order_no });
                    this.setState({ orderDate: responseJson.order_details.order_date });
                    this.setState({ grandTotal: responseJson.order_details.grand_total });
                    this.setState({ orderStatus: responseJson.order_details.order_status });
                    this.setState({ orderType: responseJson.order_details.order_type });
                    this.setState({ customerName: responseJson.order_details.customer_name });
                    this.setState({ customerEmail: responseJson.order_details.customer_email });
                    this.setState({ customerMobile: responseJson.order_details.customer_mobile });
                    this.setState({ paymentType: responseJson.order_details.payment_type });
                    this.setState({ restaurantName: responseJson.order_details.business_name });
                    this.setState({ subTotal: responseJson.order_details.sub_total });
                    this.setState({ gst: responseJson.order_details.gst });
                    console.log('Succeuss Order details', this.state.items);
                } else {
                    console.log('fail Order details', responseJson);
                }
            })
            .catch(error => {
                this.setState({ loadings: false })
                console.log('not fatch API Order Details', error);
            });
    }

    setModalVisible = (visible) => {
        this.setState({ modalVisible: visible });
    }

    changeStatusFinal(status, selectedItem) {
        var dataToSend = {
            device_id: deviceID,
            ip_address: this.state.ipAddress,
            login_id: this.state.loginId,
            hash: this.state.hash,
            seller_id: this.state.sellerId,
            order_id: this.state.orderId,
            status: status,
            time: selectedItem
        };
        console.log(dataToSend)
        var formBody = [];
        for (var key in dataToSend) {
            var encodedKey = encodeURIComponent(key);
            var encodedValue = encodeURIComponent(dataToSend[key]);
            formBody.push(encodedKey + '=' + encodedValue);
        }
        formBody = formBody.join('&');
        fetch('https://letsfoodguru.com/api/?v=1.0&device-type=2&service=change-restaurant-order-status', {
            method: 'POST',
            body: formBody,
            headers: {
                'Accept': "application/json",
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }).then(response => response.json())
            .then(responseJson => {
                this.setState({ loadings: false })
                console.log("-----------------", responseJson);
                if (responseJson.error == 0) {
                    console.log('Succeuss order status change');

                } else {
                    console.log('fail Order status change', responseJson);
                }
            })
            .catch(error => {
                setTimeout(() => {
                    this.setState({ loadings: false })
                }, 1000);
                console.log('not fatch API order status', error);
            });
    }

    changeStatus(newStatus) {
        if (this.state.autoAccept == 0 && newStatus == 2) {
            this.setModalVisible(true);
        }
        else {
            this.setState({
                modalVisible: false,
                loadings: true
            }, () => {
                this.changeStatusFinal(newStatus, '0')
            })
        }
    }

    renderFoodItems = ({ item, index }) => {
        return (
            <View style={{ flex: 1, marginTop: 10, marginHorizontal: 10 }}>
                <Text
                    numberOfLines={2}
                    ellipsizeMode={"tail"}
                    style={{ width: "100%", fontSize: 15, color: '#3A423E', fontWeight: 'bold' }}>{item.item_name} (QTY:{item.qty})</Text>

                <View style={{ flex: 1, flexDirection: 'row', marginTop: 3 }}>
                    <Text style={styles.rupeesText}>Item Price :  ₹ {item.price}</Text>

                    <View style={styles.rupeesContainer}>
                        <Text style={styles.rupeesText}>Item Total:-  ₹ {item.item_total}</Text>
                    </View>
                </View>

            </View>
        )
    }

    keyExtractorForItem = (item, index) => {
        return index.toString();
    }



    render() {

        let selectedItem = this.state.radioButtons.find(e => e.checked == true);
        selectedItem = selectedItem ? selectedItem.value : this.state.radioButtons[0].value;

        return (
            <View style={{ flex: 1, backgroundColor: 'white' }}>
                <Loader loading={this.state.loadings} />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal has been closed.");
                    }}>

                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <View style={{ height: 50, width: '100%', backgroundColor: '#307ecc', justifyContent: 'center', alignItems: "center", }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 17, textAlign: 'center', color: 'white' }}>Select Delivery Time</Text>
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 17, marginTop: 10 }}>Select time sloat</Text>
                            </View>
                            <RadioGroup
                                color='#0277BD'
                                labelStyle={{ fontSize: 13, }}
                                radioButtons={this.state.radioButtons}
                                onPress={radioButtons => this.setState({ radioButtons })}
                                style={{ paddingTop: 2, flexDirection: 'row' }}
                            />
                            <View style={{ flexDirection: 'row' }}>
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "#2196F3" }}
                                    onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
                                    <Text style={styles.textStyle}>Cancle</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={{ ...styles.openButton, backgroundColor: "#2196F3", marginLeft: 10 }}
                                    onPress={() => {
                                        this.setState({
                                            modalVisible: false,
                                            loadings: true
                                        }, () => {
                                            this.changeStatusFinal('2', selectedItem)
                                        })
                                    }}>
                                    <Text style={styles.textStyle}>Save</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
                <ScrollView>
                    {this.renderHeader()}
                    <View style={{ flex: 1 }}>
                        <FlatList
                            // ListHeaderComponent={() => this.renderHeader()}
                            // ListFooterComponent={() => this.renderFotter()}
                            extraData={this.state}
                            nestedScrollEnabled
                            data={this.state.items}
                            keyExtractor={this.keyExtractorForItem}
                            renderItem={this.renderFoodItems}
                        />
                    </View>
                    {this.renderFotter()}
                </ScrollView>
            </View >
        )
    }

    renderHeader() {
        return (
            <View style={{ marginLeft: 10, marginRight: 10, zIndex: 1000 }}>

                <View style={{ height: 1, marginTop: 5, backgroundColor: "black", }}></View>

                <Text style={styles.itemTextHeading}>Order Details :</Text>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Order No :</Text>
                    <Text style={styles.itemText}>{this.state.orderNo}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Order Date :</Text>
                    <Text style={styles.itemText}>{this.state.orderDate}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Total Price :</Text>
                    <Text style={styles.itemText}>{this.state.grandTotal}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Order Status :</Text>
                    <Text style={styles.itemText}>{this.state.orderStatus}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Order Type :</Text>
                    <Text style={styles.itemText}>{this.state.orderType}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Customer Name :</Text>
                    <Text style={styles.itemText}>{this.state.customerName}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Email :</Text>
                    <Text style={styles.itemText}>{this.state.customerEmail}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Mobile :</Text>
                    <Text style={styles.itemText}>{this.state.customerMobile}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Payment Type :</Text>
                    <Text style={styles.itemText}>{this.state.paymentType}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Restaurant :</Text>
                    <Text style={styles.itemText}>{this.state.restaurantName}</Text>
                </View>

                <Text style={styles.text}>Status :</Text>

                <View style={{ marginTop: 10, zIndex: 2000 }}>
                    <DropDownPicker
                        items={[
                            { label: 'Pending', value: '1', hidden: true },
                            { label: 'Accepted', value: '2' },
                            { label: 'In Preparation', value: '3' },
                            { label: 'Prepared', value: '4' },
                            { label: 'Out for delivery', value: '5' },
                            { label: 'Delivered', value: '6' },
                            { label: 'Completed', value: '7' },
                            { label: 'Rejected', value: '8' },
                            { label: 'Missed', value: '9' },
                            { label: 'Cancelled', value: '10' },
                        ]}
                        // defaultValue={this.state.orderStatus}
                        placeholder={this.state.orderStatus}
                        containerStyle={{ height: 40 }}
                        style={{ backgroundColor: 'white', marginStart: 10, marginEnd: 10, borderColor: '#224abe' }}
                        itemStyle={{ justifyContent: 'flex-start' }}
                        dropDownStyle={{ backgroundColor: '#fafafa', borderColor: 'gray' }}
                        onChangeItem={item => this.changeStatus(item.value)}
                    />
                </View>

                <View style={styles.blackDivider}></View>

                <Text style={styles.itemTextHeading}>Item Details :</Text>

            </View>
        )
    }

    renderFotter() {
        return (
            <View style={{ marginLeft: 10, marginRight: 10 }}>

                <View style={styles.blackDivider}></View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>Sub Total :</Text>
                    <Text style={styles.itemText}>₹ {this.state.subTotal}</Text>
                </View>

                <View style={styles.detailContainer}>
                    <Text style={styles.text}>GST (18%) :</Text>
                    <Text style={styles.itemText}>₹ {this.state.gst}</Text>
                </View>

                <View style={styles.blackDivider}></View>

                <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Text style={{ color: '#3A423E', fontSize: 15, fontWeight: 'bold' }}>Total :</Text>
                    <Text style={styles.itemText}>₹ {this.state.grandTotal}</Text>
                </View>

                <View style={styles.blackDivider}></View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    rupeesContainer: {
        position: 'absolute',
        end: 0,
        marginEnd: 10
    },
    detailContainer: {
        flexDirection: 'row',
        marginTop: 5,
        marginBottom: 5,
    },
    itemTextHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        color: 'black',
        marginTop: 5
    },
    rupeesText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#3A423E'
    },
    blackDivider: {
        height: 1,
        marginTop: 15,
        marginBottom: 5,
        backgroundColor: "black",
    },
    text: {
        color: "#3A423E",
        fontSize: 15
    },
    itemText: {
        marginLeft: 15,
        color: "#3A423E",
        fontWeight: 'bold',
        fontSize: 15
    },




    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },
    modalView: {
        height: '30%',
        width: '95%',
        margin: 0,
        backgroundColor: "#D1D8D4",
        borderRadius: 0,
        borderColor: 'black',
        alignItems: "center",
    },
    openButton: {
        width: 75,
        backgroundColor: "#307ecc",
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginBottom: 5
    },
    textStyle: {
        fontSize: 15,
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    }
});