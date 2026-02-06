import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import { addNotification } from "../redux/slices/notificationSlice";
import backendIP from "../api/api";

let client;

export const startNotificationSocket = (userId, token, dispatch) => {
    if (client?.active) {
        console.log("🟢 Socket already active");
        return;
    }
    console.log("🚀 Starting socket...");
    const wsBase = backendIP.replace("/api", "");
    const socket = new SockJS(`${wsBase}/ws-chat?userId=${userId}`);

    client = new Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
            Authorization: `Bearer ${token}`,
        },

        onConnect: () => {
            console.log("✅ Socket connected");

            client.subscribe(
                "/user/queue/notifications/user",
                msg => {
                    console.log("📩 LIVE MESSAGE RECEIVED:", msg.body);
                    dispatch(addNotification(JSON.parse(msg.body)));
                }
            );
        },

        onStompError: err => {
            console.error("❌ STOMP error:", err);
        },

        onWebSocketError: err => {
            console.error("❌ WS error:", err);
        },
    });

    client.activate();
};

export const stopNotificationSocket = () => {
    console.log("🔌 Stopping socket");

    client?.deactivate();
    client = null;
};