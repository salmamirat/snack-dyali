import { Platform } from "react-native";
import Constants from "expo-constants";
import * as TaskManager from "expo-task-manager";
import * as BackgroundTask from "expo-background-task";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/axios";

export const BACKGROUND_SYNC_TASK = "BACKGROUND_SYNC_TASK";

let NotificationsModule: any = null;

async function getNotificationsModule() {
  if (Platform.OS === "android" && Constants.appOwnership === "expo") {
    return null;
  }
  if (!NotificationsModule) {
    try {
      NotificationsModule = await import("expo-notifications");
      NotificationsModule.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: false,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (error) {
      console.warn("expo-notifications is not supported in this environment", error);
    }
  }
  return NotificationsModule;
}

TaskManager.defineTask(BACKGROUND_SYNC_TASK, async () => {
  try {
    const { data } = await api.get("/plats");
    const cachedData = await AsyncStorage.getItem("plats_cache");

    if (cachedData && cachedData !== JSON.stringify(data)) {
      const Notifications = await getNotificationsModule();
      if (Notifications) {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: "Menu mis à jour 🍔",
            body: "Le menu du Snack Dyali a été mis à jour avec de nouveaux plats ou prix !",
          },
          trigger: null,
        });
      }
    }

    await AsyncStorage.setItem("plats_cache", JSON.stringify(data));
    await AsyncStorage.setItem("last_sync", new Date().toISOString());
    return BackgroundTask.BackgroundTaskResult.Success;
  } catch (error) {
    return BackgroundTask.BackgroundTaskResult.Failed;
  }
});

export const registerBackgroundSync = async () => {
  try {
    const Notifications = await getNotificationsModule();
    if (Notifications) {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        console.log('Notification permissions not granted');
      }
    }

    const isRegistered = await TaskManager.isTaskRegisteredAsync(BACKGROUND_SYNC_TASK);
    if (!isRegistered) {
      await BackgroundTask.registerTaskAsync(BACKGROUND_SYNC_TASK, {
        minimumInterval: 15,
      });
    }
  } catch (error) {
    console.error(error);
  }
};
