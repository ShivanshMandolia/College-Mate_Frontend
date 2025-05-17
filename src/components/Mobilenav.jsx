import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const MobileNav = ({ userRole, isSuperAdmin }) => {
  const location = useLocation();

  const getNavItems = () => {
    if (isSuperAdmin) {
      return [
        { path: '/superadmin/dashboard', label: 'Dashboard' },
        { path: '/superadmin/complaints', label: 'Complaints' },
        { path: '/superadmin/add-placement', label: 'Add Placement' },
      ];
    }

    if (userRole === 'admin') {
      return [
        { path: '/admin/dashboard', label: 'Dashboard' },
        { path: '/admin/complaints', label: 'Complaints' },
        { path: '/admin/events', label: 'Events' },
        { path: '/admin/create-event', label: 'Create Event' },
      ];
    }

    return [
      { path: '/student/dashboard', label: 'Dashboard' },
      { path: '/student/complaints', label: 'Complaints' },
      { path: '/student/events', label: 'Events' },
      { path: '/student/lost-found', label: 'Lost & Found' },
      { path: '/student/placements', label: 'Placements' },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex flex-col items-center justify-center py-2 text-xs ${
              location.pathname === item.path
                ? 'text-blue-600'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;