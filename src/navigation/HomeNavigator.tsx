import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/home/HomeScreen';
import ScanTicketScreen from '../screens/scan/ScanTicketScreen';
import ScanResultScreen from '../screens/scan/ScanResultScreen';
import ExpenseHomeScreen from '../screens/expense/ExpenseHomeScreen';
import ManualExpenseScreen from '../screens/expense/ManualExpenseScreen';
import ScanMileageResultScreen from '../screens/mileage/ScanMileageResultScreen';

const Stack = createStackNavigator();

const HomeNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="ScanTicket" component={ScanTicketScreen} />
      <Stack.Screen name="ScanResult" component={ScanResultScreen} />
      <Stack.Screen name="ExpenseHome" component={ExpenseHomeScreen} />
      <Stack.Screen name="ManualExpense" component={ManualExpenseScreen} />
      <Stack.Screen name="ScanMileageResult" component={ScanMileageResultScreen} />
    </Stack.Navigator>
  );
};

export default HomeNavigator;