import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

const Message = ({ variant = 'info', children }) => {
  const getIcon = () => {
    switch (variant) {
      case 'danger':
        return <AlertCircle size={20} />;
      case 'success':
        return <CheckCircle2 size={20} />;
      default:
        return <Info size={20} />;
    }
  };

  return <div className={`alert alert-${variant}`}>{getIcon()} {children}</div>;
};

export default Message;
