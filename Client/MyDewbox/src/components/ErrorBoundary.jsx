import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    if (error.response?.status === 401) {
      toast.error("Authentication failed. Please check your Webex credentials.");
    } else if (error.response?.status === 429) {
      toast.error("Too many attempts. Please try again later.");
    } else if (error.message.includes('Failed to send SMS')) {
      toast.error("Failed to send verification code. Please try again.");
    } else {
      toast.error('Something went wrong. Please try again.');
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
          <h2 className="text-red-600 font-bold">Something went wrong</h2>
          <button 
            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
            onClick={() => this.setState({ hasError: false })}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;