export const bookingConfig = {
  minNoticeMinutes: 180,
  sameDayThresholdMinutes: 180,
  bufferMinutes: 0,
  reminderOffsets: [
    { label: "24 hours before", minutes: 1440 },
    { label: "2 hours before", minutes: 120 },
  ],
  defaultStatuses: ["pending", "confirmed", "completed", "cancelled", "no_show"],
};
