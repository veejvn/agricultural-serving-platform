export const getBackgroundColorClass = (displayName: string | null) => {
  if (!displayName) return "bg-blue-500";
  const classes = [
    "bg-blue-500",
    "bg-orange-500",
    "bg-green-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-gray-500",
    "bg-yellow-500",
    "bg-teal-500",
    "bg-cyan-500",
  ];
  let hash = 0;
  for (let i = 0; i < displayName.length; i++) {
    hash = displayName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const idx = Math.abs(hash) % classes.length;
  return classes[idx];
};
