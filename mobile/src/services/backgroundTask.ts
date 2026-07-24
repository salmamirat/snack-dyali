import * as TaskManager from "expo-task-manager";
import * as BackgroundFetch from "expo-background-task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import api from "../api/axios";

export const BACKGROUND_SYNC_TASK = "BACKGROUND_SYNC_TASK";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const { data } = await api.get("/plats");
    const cachedData = await AsyncStorage.getItem("plats_cache");
    
    // Compare stringified data to detect changes
    if (cachedData && cachedData !== JSON.stringify(data)) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Menu mis à jour 🍔",
          body: "Le menu du Snack Dyali a été mis à jour avec de nouveaux plats ou prix !",
        },
        trigger: null,
      });
    }

    await AsyncStorage.setItem("plats_cache", JSON.stringify(data));
    await AsyncStorage.setItem("last_sync", new Date().toISOString());
    console.log("Background sync successful at", new Date().toISOString());
    
    // @ts-ignore
    return BackgroundFetch.BackgroundTaskResult ? BackgroundFetch.BackgroundTaskResult.NewData : 1; 
  } catch (error) {
    console.error("Background sync failed", error);
    // @ts-ignore
    return BackgroundFetch.BackgroundTaskResult ? BackgroundFetch.BackgroundTaskResult.Failed : 2;
  }
});

export const registerBackgroundSync = async () => {
  try {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      await BackgroundFetch.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 60 * 15,   
      });
      console.log("Task registered");
    }
  } catch (error) {
    console.error("Task registration failed", error);
  }
};
