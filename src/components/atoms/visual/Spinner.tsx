export const Spinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75 -z-50">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500 border-solid"></div>
    {/* Alternative with react-spinners: */}
    {/* <ClipLoader color="#3B82F6" size={48} /> */}
  </div>
);
