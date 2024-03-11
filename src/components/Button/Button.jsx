import cn from 'classnames';
import PropTypes from 'prop-types';

export const Button = ({
  type = 'button',
  className = '',
  children,
  onClick = () => {},
  ...props
}) => {
  return (
    <button
      type={type}
      className={cn('button', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

Button.propTypes = {
  type: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
  onClick: PropTypes.func,
};
