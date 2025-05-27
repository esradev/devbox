export function getStatusColor(status: string) {
  switch (status) {
    case "connected":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "disconnected":
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
    case "error":
      return "bg-red-500/10 text-red-600 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}

export function getPostStatusColor(status: string) {
  switch (status) {
    case "publish":
      return "bg-green-500/10 text-green-600 border-green-500/20";
    case "draft":
      return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
    case "private":
      return "bg-blue-500/10 text-blue-600 border-blue-500/20";
    default:
      return "bg-gray-500/10 text-gray-600 border-gray-500/20";
  }
}
