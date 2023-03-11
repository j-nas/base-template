export default function LoadingSpinner() {
  return (
    <div className="flex flex-col place-content-center place-items-center gap-2">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
      <span>Loading...</span>
    </div>
  );
}
