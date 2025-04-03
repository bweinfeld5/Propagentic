import React, { useState } from 'react';
import { XIcon, BellIcon } from '@heroicons/react/outline';
import { CheckCircleIcon, ExclamationIcon, InformationCircleIcon } from '@heroicons/react/solid';

const NotificationPanel = ({ isOpen, onClose }) => {
  // Sample notifications - in a real app, these would come from a database or context
  const [notifications] = useState([
    {
      id: 1,
      type: 'success',
      title: 'Request Completed',
      message: 'Your maintenance request #2457 has been completed.',
      time: '10 minutes ago',
      read: false
    },
    {
      id: 2,
      type: 'info',
      title: 'Request Classified',
      message: 'AI has classified your new request as "Plumbing" with High urgency.',
      time: '2 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'warning',
      title: 'Contractor Assignment',
      message: 'Your request has been assigned to John Smith (Plumber).',
      time: '1 day ago',
      read: true
    }
  ]);

  // Get icon based on notification type
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-6 w-6 text-green-500" />;
      case 'warning':
        return <ExclamationIcon className="h-6 w-6 text-yellow-500" />;
      case 'error':
        return <ExclamationIcon className="h-6 w-6 text-red-500" />;
      case 'info':
      default:
        return <InformationCircleIcon className="h-6 w-6 text-blue-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 overflow-hidden z-50" role="dialog" aria-modal="true">
      {/* Background overlay */}
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose}></div>

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md">
          <div className="h-full flex flex-col bg-white shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="px-4 py-6 bg-[#176B5D] sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium text-white flex items-center">
                  <BellIcon className="h-6 w-6 mr-2" />
                  Notifications
                </h2>
                <div className="ml-3 h-7 flex items-center">
                  <button
                    type="button"
                    className="bg-[#176B5D] rounded-md text-teal-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                    onClick={onClose}
                  >
                    <span className="sr-only">Close panel</span>
                    <XIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-1">
                <p className="text-sm text-teal-100">
                  Updates about your maintenance requests and property.
                </p>
              </div>
            </div>

            {/* Notification list */}
            <div className="flex-1 overflow-y-auto">
              <ul className="divide-y divide-gray-200">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <li key={notification.id} className={`px-4 py-4 sm:px-6 ${notification.read ? 'bg-white' : 'bg-teal-50'}`}>
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          {getIcon(notification.type)}
                        </div>
                        <div className="ml-3 flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {notification.time}
                            </p>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {notification.message}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-12 text-center">
                    <p className="text-sm text-gray-500">No notifications yet.</p>
                    <p className="mt-1 text-sm text-gray-500">
                      When you submit maintenance requests, updates will appear here.
                    </p>
                  </li>
                )}
              </ul>
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-gray-200 p-4">
                <button
                  type="button"
                  className="w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md text-teal-700 bg-teal-50 hover:bg-teal-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                >
                  Mark all as read
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPanel; 