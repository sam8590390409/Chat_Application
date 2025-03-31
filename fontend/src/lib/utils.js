export function formatMessageTime(date) {
  if (!date) return "Unknown time"; // Handle undefined timestamps
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    // Include seconds for precise time
    hour12: true, // Display in AM/PM format
  });
}
