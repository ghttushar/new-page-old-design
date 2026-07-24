const responseMessages: Record<number | string, Record<string, string>> = {
  GENERIC: {
    title: 'Sorry about that!',
    description: 'There was a small issue. Please try again in a moment.',
  },
  '401': {
    title: 'Session Expired',
    description: 'Your session has expired. Please log in again.',
  },
  '403': {
    title: 'Access Forbidden',
    description: `You're not allowed to access this page. If you think this is a mistake, please contact support.`,
  },
  '409': {
    title: 'Account Selection Required',
    description:
      'You have been logged out from the account. Please select your account again.',
  },
  '404': {
    title: 'Resource Not Found',
    description: `Oops! The requested resource could not be found. Please check your request and try again. Thank you!`,
  },
  '405': {
    title: 'Request Error',
    description: `Sorry, there's an issue with your request. Please review and try again. Contact support if needed. Thank you!`,
  },
  '429': {
    title: 'Rate Limit Exceeded',
    description: `You've reached the maximum number of requests allowed. Please wait a few seconds before trying again.`,
  },
  '503': {
    title: 'Service Unavailable',
    description:
      'Oops! Our backend is temporarily down. Please try again later. Thank you!',
  },
  '504': {
    title: 'Oops! Request Timed Out',
    description: `Sorry, your request took longer than expected to process. Please try again later or contact support if the issue persists. We apologize for the inconvenience.`,
  },
  ERR_NETWORK: {
    title: 'Connection Issue',
    description: `We're having trouble reaching the server. Please check your internet connection and try again.`,
  },
  ECONNABORTED: {
    title: 'Request Timeout',
    description: `Oops! Your request took longer than expected to process. Please try again later. Thank you!`,
  },
  ECONNREFUSED: {
    title: 'Connection Refused',
    description: `Oops! It seems the server refused the connection. Please try again later. Thank you!`,
  },
};

export default responseMessages;
