interface loadingProps {
  message?: string;
}

export default function Loading({message = 'Loading...'}: loadingProps) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600"> {message} </p>
        </div>
      </div>
    );
}