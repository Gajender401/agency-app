import GlobalProvider from '@/context/GlobalProvider';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <GlobalProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/onbording" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/welcome" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/login" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/signup" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/forgotPassword" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/verify" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/accountCreatedDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/premiumDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPasswordDone" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/resetPassword" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/editProfile" options={{ headerShown: false }} />

        <Stack.Screen name="(modals)/(home)/drivers_list" options={{  headerShadowVisible:false, headerTitle:"Driver List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/cleaners_list" options={{ headerShadowVisible:false, headerTitle:"Cleaner List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/employee_list" options={{ headerShadowVisible:false, headerTitle:"Employee List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/driver_available" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/(home)/(forms)/edit_profile" options={{ headerShown: false }} />
        <Stack.Screen name="(modals)/(home)/all_vehicle_list" options={{ headerShadowVisible:false, headerTitle:"All Vehicle List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/car_list" options={{ headerShadowVisible:false, headerTitle:"Car List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/bus_list" options={{ headerShadowVisible:false, headerTitle:"Bus List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/tempo_list" options={{ headerShadowVisible:false, headerTitle:"Tempo List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/truck_list" options={{ headerShadowVisible:false, headerTitle:"Truck List", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle booking", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/package_vehicle_booking_more/[pkgId]" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle booking", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/daily_route_vehicles" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/technician_support" options={{ headerShadowVisible:false, headerTitle:"Technician Support", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/vehicle_documents" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/vehicle_servicing_history" options={{ headerShadowVisible:false, headerTitle:"Vehicle Servicing history", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/sell_vehicle" options={{ headerShadowVisible:false, headerTitle:" Sell Vehicle", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/rent_vehicle" options={{ headerShadowVisible:false, headerTitle:" Rent Vehicle", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/all_photos" options={{ headerShadowVisible:false, headerTitle:"Gallery", headerTitleAlign:"center" }} />

        <Stack.Screen name="(modals)/(home)/(forms)/add_cleaner" options={{ headerShadowVisible:false, headerTitle:"Add Cleaner", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_driver" options={{ headerShadowVisible:false, headerTitle:"Add Driver", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_employee" options={{ headerShadowVisible:false, headerTitle:"Add Employee", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_car" options={{ headerShadowVisible:false, headerTitle:"Add Car", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_bus" options={{ headerShadowVisible:false, headerTitle:"Add Bus", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_tempo" options={{ headerShadowVisible:false, headerTitle:"Add Tempo", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_truck" options={{ headerShadowVisible:false, headerTitle:"Add Truck", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_package_vehicle_booking" options={{ headerShadowVisible:false, headerTitle:"Package Vehicle Booking Form", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_daily_route_vehicles" options={{ headerShadowVisible:false, headerTitle:"Daily Route Vehicles", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_technician" options={{ headerShadowVisible:false, headerTitle:"Add Technician", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_vehicle_documents" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/(home)/(forms)/add_vehicle_inspection" options={{ headerShadowVisible:false, headerTitle:"Vehicle Documents", headerTitleAlign:"center" }} />
        <Stack.Screen name="(modals)/plans" options={{ headerShadowVisible:false, headerTitle:"Premium", headerTitleAlign:"center" }} />

        <Stack.Screen name="+not-found" />
      </Stack>
      <Toast />
    </GlobalProvider>
  );
}
