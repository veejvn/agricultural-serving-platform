export default function Loading() {
  return (
    <div className="text-center py-8">
      <div className="flex items-center justify-center space-x-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        <span className="text-muted-foreground">Đang tải đơn hàng...</span>
      </div>
    </div>
  );
}
