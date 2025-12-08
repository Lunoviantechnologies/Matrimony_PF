import { useEffect, useState } from "react";
import axios from "axios";
import backendIP from "../api/api";

const useAcceptedContacts = (userId) => {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const fetchAcceptedRequests = async () => {
            try {
                // Requests where YOU are the receiver
                const received = await axios.get(
                    `${backendIP}/friends/accepted/received/${userId}`
                );

                // Requests where YOU are the sender
                const sent = await axios.get(
                    `${backendIP}/friends/accepted/sent/${userId}`
                );

                // Merge both arrays
                const merged = [...received.data, ...sent.data];

                // Map merged requests into contact list format
                const contactList = merged.map((req) => {
                    if (req.senderId === userId) {
                        // You sent the request → other user = receiver
                        return {
                            requestId: req.requestId,
                            userId: req.receiverId,
                            name: req.receiverName,
                            image: req.receiverImage,
                            senderId: req.senderId,
                            receiverId: req.receiverId,
                        };
                    } else {
                        // You received the request → other user = sender
                        return {
                            requestId: req.requestId,
                            userId: req.senderId,
                            name: req.senderName,
                            image: req.senderImage,
                            senderId: req.senderId,
                            receiverId: req.receiverId,
                        };
                    }
                });

                setContacts(contactList);
            } catch (err) {
                console.error("Error fetching accepted requests:", err);
            }
        };

        fetchAcceptedRequests();
    }, [userId]);

    return contacts;
};

export default useAcceptedContacts;