import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';

import OrdersScreen from '../drawerScreen/OrdersScreen';
import AddCategory from '../drawerScreen/AddCategory';
import CustomSidebarMenu from '../components/CustomSidebarMenu';
import NavigationDrawerHeader from '../components/NavigationDrawerHeader';
import OrderDetail from '../screen/OrderDetail'
import AddMenu from '../drawerScreen/AddMenu'

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const OrdersScreenStack = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="OrdersScreen">
      <Stack.Screen
        name="OrdersScreen"
        component={OrdersScreen}
        options={{
          title: 'Orders', //Set Header Title
          headerLeft: () => (
            <NavigationDrawerHeader navigationProps={navigation} />
          ),
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
      <Stack.Screen
        name="OrderDetail"
        component={OrderDetail}
        options={{
          title: 'Order Details', //Set Header Title
          
          headerStyle: {
            backgroundColor: '#307ecc', //Set Header color
          },
          headerTintColor: '#fff', //Set Header text color
          headerTitleStyle: {
            fontWeight: 'bold', //Set Header text style
          },
        }}
      />
    </Stack.Navigator>
  );
};

const AddCategoryStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Add Category"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="AddCategory"
        component={AddCategory}
        options={{
          title: 'Menu Category', //Set Header Title
        }}
      />
      
    </Stack.Navigator>
  );
};

const AddMenuStack = ({ navigation }) => {
  return (
    <Stack.Navigator
      initialRouteName="Add Menu"
      screenOptions={{
        headerLeft: () => (
          <NavigationDrawerHeader navigationProps={navigation} />
        ),
        headerStyle: {
          backgroundColor: '#307ecc', //Set Header color
        },
        headerTintColor: '#fff', //Set Header text color
        headerTitleStyle: {
          fontWeight: 'bold', //Set Header text style
        },
      }}>
      <Stack.Screen
        name="AddMenu"
        component={AddMenu}
        options={{
          title: 'Add Menu', //Set Header Title
        }}
      />
      
    </Stack.Navigator>
  );
};

const DrawerNavigatorRoutes = (props) => {
  return (
    <Drawer.Navigator
      drawerContentOptions={{
        activeTintColor: '#cee1f2',
        color: '#cee1f2',
        itemStyle: { marginVertical: 5, color: 'white' },
        labelStyle: {
          color: '#d8d8d8',
        },
      }}
      screenOptions={{ headerShown: false }}
      drawerContent={CustomSidebarMenu}>
      <Drawer.Screen
        name="OrdersScreenStack"
        options={{ drawerLabel: 'Orders' }}
        component={OrdersScreenStack}
      />
      <Drawer.Screen
        name="AddCategoryStack"
        options={{ drawerLabel: 'Add Category' }}
        component={AddCategoryStack}
      />
      <Drawer.Screen
        name="AddMenuStack"
        options={{ drawerLabel: 'Add Menu' }}
        component={AddMenuStack}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigatorRoutes;