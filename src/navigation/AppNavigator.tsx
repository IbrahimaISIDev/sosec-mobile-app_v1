import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeNavigator from './HomeNavigator';
import TruckScreen from '../screens/truck/TruckScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import ScanMileageScreen from '../screens/mileage/ScanMileageScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';

// Typage des icônes avec Ionicons['name']
type IconName = React.ComponentProps<typeof Ionicons>['name'];

const Tab = createBottomTabNavigator();

// Mapping des icônes pour chaque route avec typage strict
const ICON_MAPPING: Record<string, { active: IconName; inactive: IconName }> = {
  Accueil: { active: 'home', inactive: 'home-outline' },
  Camion: { active: 'car', inactive: 'car-outline' },
  Historique: { active: 'list', inactive: 'list-outline' },
  Kilométrage: { active: 'speedometer', inactive: 'speedometer-outline' },
  Profil: { active: 'person', inactive: 'person-outline' },
};

const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          const icons = ICON_MAPPING[route.name] || {
            active: 'help-circle' as const,
            inactive: 'help-circle-outline' as const,
          };
          const iconName = focused ? icons.active : icons.inactive;

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0066CC',
        tabBarInactiveTintColor: '#999999',
        tabBarStyle: {
          height: 60,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
      })}
    >
      <Tab.Screen name="Accueil" component={HomeNavigator} />
      <Tab.Screen name="Camion" component={TruckScreen} />
      <Tab.Screen name="Historique" component={HistoryScreen} />
      <Tab.Screen name="Kilométrage" component={ScanMileageScreen} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default AppNavigator;