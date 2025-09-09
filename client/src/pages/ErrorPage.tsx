import { useRouteError, Link, isRouteErrorResponse } from 'react-router-dom';

export default function ErrorPage() {
  const error = useRouteError();

  // Determine error details
  let errorMessage = "The page you're looking for doesn't exist or an unexpected error occurred.";
  let errorStatus = '404';
  let errorTitle = "Oops! Something went wrong";

  if (isRouteErrorResponse(error)) {
    errorStatus = error.status.toString();
    errorMessage = error.data || error.statusText || errorMessage;
    
    // Customize based on status
    if (error.status === 404) {
      errorTitle = "Page Not Found";
      errorMessage = "The page you're looking for doesn't exist.";
    } else if (error.status === 401) {
      errorTitle = "Unauthorized";
      errorMessage = "You don't have permission to access this page.";
    } else if (error.status === 500) {
      errorTitle = "Server Error";
      errorMessage = "Something went wrong on our end.";
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
    errorStatus = 'Error';
    errorTitle = "Something went wrong";
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <div>
          <div className="mx-auto h-24 w-24 text-red-500 mb-6">
            <svg 
              className="w-full h-full" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
              />
            </svg>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-4">
            {errorStatus}
          </h1>
          
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">
            {errorTitle}
          </h2>
          
          <p className="text-gray-600 mb-8 max-w-sm mx-auto">
            {errorMessage}
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="w-full flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Go back home
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="w-full flex justify-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
          >
            Go back
          </button>
        </div>

        <div className="mt-8 text-xs text-gray-500">
          If this problem persists, please contact support.
        </div>
      </div>
    </div>
  );
}