import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const RButton = ({
  children,
  onClick,
  hoverEffect = true,
  visibleTo = 'all',
  ...props
}) => {
  // Check if the button should be rendered based on visibleTo prop
  if (visibleTo !== 'all' && visibleTo !== props.currentUserType) {
    return null;
  }
  
  const baseStyle = {
    backgroundColor: '#FF5252',
    color: '#f8f9fa',
    fontWeight: 'bold',
    padding: '0.5rem 1rem',
    borderRadius: '9999px',
    border: 'none',
    transition: 'all 0.3s ease-in-out',
  };

  const hoverStyle = hoverEffect
    ? {
      '&:hover': {
        backgroundColor: '#f8f9fa',
        color: '#FF5252',
        border: '1px solid #FF5252',
      },
    }
    : {};
    const { currentUserType, ...buttonProps } = props;
  return (
    <Button
      onClick={onClick}
      style={{
        ...baseStyle,
        ...hoverStyle,
      }}
      {...props}
    >
      {children}
    </Button>
  );
};

RButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
  visibleTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
};

export default RButton;


/**
 * 
 * 
 * import RButton from './path/to/rButton';

const ParentComponent = ({ currentUserType }) => {
  return (
    <div>
      {(currentUserType === 'admin' || currentUserType === 'manager') && (
        <RButton onClick={handleClick} hoverEffect={true}>
          Admin Action
        </RButton>
      )}
      <RButton onClick={handleClick} hoverEffect={false}>
        Action for All Users
      </Button>
    </div>
  );
};
 */