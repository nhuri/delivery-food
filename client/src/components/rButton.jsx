import React from 'react';
import { Button } from 'react-bootstrap';
import PropTypes from 'prop-types';

const RButton = ({
  children,
  onClick,
  hoverEffect = true,
  visibleTo = 'all',
  currentUserType,
  ...props
}) => {
  // Check if the button should be rendered based on visibleTo prop
  if (visibleTo !== 'all' && visibleTo !== currentUserType) {
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

  const [style, setStyle] = React.useState(baseStyle);
  // Added state for dynamic styling

  const handleMouseEnter = () => {
    if (hoverEffect) {
      setStyle({
        ...baseStyle,
        backgroundColor: '#f8f9fa',
        color: '#FF5252',
        border: '1px solid #FF5252',
      });
    }
  };
  // Added handleMouseEnter function

  const handleMouseLeave = () => {
    if (hoverEffect) {
      setStyle(baseStyle);
    }
  };
  // Added handleMouseLeave function

  return (
    <Button
      onClick={onClick}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Button>
  );
};
// Updated Button component to use state for styling and handle hover effects

RButton.propTypes = {
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func,
  hoverEffect: PropTypes.bool,
  visibleTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.arrayOf(PropTypes.string)
  ]),
  currentUserType: PropTypes.string,
};
// Added currentUserType to propTypes

export default RButton;