export type NotificationType = "Placement" | "Result" | "Event";

export type NotificationRecord = {
  ID: string;
  Type: NotificationType;
  Message: string;
  Timestamp: string;
};

export type NotificationsResponse = {
  notifications: NotificationRecord[];
};
