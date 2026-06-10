import { Link } from 'react-router-dom';
import clsx from 'clsx';

const variantClasses = {
  amber: 'border-amber-600 text-amber-600 hover:bg-amber-700 hover:text-white',
  lime: 'border-lime-600 text-lime-600 hover:bg-lime-700 hover:text-white',
  yellow: 'border-yellow-600 text-yellow-600 hover:bg-yellow-700 hover:text-white',
  green: 'border-green-600 text-green-600 hover:bg-green-700 hover:text-white',
  emerald: 'border-emerald-600 text-emerald-600 hover:bg-emerald-700 hover:text-white',

  // new variants
  blue: 'border-blue-600 text-blue-600 hover:bg-blue-700 hover:text-white',
  indigo: 'border-indigo-600 text-indigo-600 hover:bg-indigo-700 hover:text-white',
  purple: 'border-purple-600 text-purple-600 hover:bg-purple-700 hover:text-white',
  pink: 'border-pink-600 text-pink-600 hover:bg-pink-700 hover:text-white',
  red: 'border-red-600 text-red-600 hover:bg-red-700 hover:text-white',
  gray: 'border-gray-600 text-gray-600 hover:bg-gray-700 hover:text-white',
};

const StyledButton = ({ to, label, variant = 'amber', rounded = false }) => {
  return (
    <Link
      to={to}
      className={clsx(
        'inline-block border px-4 py-2 transition duration-200 shadow-sm',
        rounded ? 'rounded-full' : 'rounded',
        variantClasses[variant]
      )}
    >
      {label}
    </Link>
  );
};

export default StyledButton;
