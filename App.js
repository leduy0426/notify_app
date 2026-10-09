import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  Alert,
  KeyboardAvoidingView,
  SafeAreaView,
} from 'react-native';
import * as Notifications from 'expo-notifications';
import { StatusBar } from 'expo-status-bar';

// Cấu hình hiển thị thông báo khi app đang ở tiền cảnh (foreground)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  // Yêu cầu 3: Thoát ứng dụng vào lại sẽ để basic là "Name"
  const [inputText, setInputText] = useState('Name');
  const responseListener = useRef(null);

  useEffect(() => {
    // Đăng ký cấp quyền và kênh thông báo
    registerForPushNotificationsAsync();

    // Yêu cầu 4: Lắng nghe sự kiện người dùng bấm vào thông báo khi app đang chạy hoặc ở background
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const nameFromNotification =
        response.notification.request.content.data?.name ||
        response.notification.request.content.body;
      if (nameFromNotification) {
        setInputText(nameFromNotification);
      }
    });

    // Yêu cầu 4: Xử lý trường hợp ứng dụng mở từ trạng thái bị đóng hẳn (cold start) bằng cách chạm thông báo
    Notifications.getLastNotificationResponseAsync().then(response => {
      if (response && response.notification) {
        const nameFromNotification =
          response.notification.request.content.data?.name ||
          response.notification.request.content.body;
        if (nameFromNotification) {
          setInputText(nameFromNotification);
        }
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  // Yêu cầu 2: Bấm vào nút sẽ bắn thông báo với nội dung nhập ở input text
  const handleSendNotification = async () => {
    const textToSend = inputText.trim() || 'Name';

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Thông báo',
          body: textToSend,
          data: { name: textToSend },
          sound: true,
        },
        trigger: null, // Gửi ngay lập tức
      });
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể gửi thông báo: ' + error.message);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Notify App 🔔</Text>
          <Text style={styles.subtitle}>
            Nhập tên/nội dung bên dưới và bấm nút "Notify" để nhận thông báo.
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nội dung / Tên:</Text>
            <TextInput
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholder="Nhập tên hoặc nội dung..."
              placeholderTextColor="#999"
              autoCapitalize="words"
            />
          </View>

          {/* Yêu cầu 1: Xây dựng button là notify */}
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={handleSendNotification}
          >
            <Text style={styles.buttonText}>Notify</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Cấu hình xin quyền & notification channel cho Android
async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Default Channel',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#4F46E5',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    height: 52,
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
  },
  button: {
    backgroundColor: '#4F46E5',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

