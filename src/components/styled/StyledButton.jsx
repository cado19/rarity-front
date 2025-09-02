import { Link } from 'react-router-dom';
import clsx from 'clsx';

const variantClasses = {
  amber: 'border-amber-600 text-amber-600 hover:bg-amber-700',
  lime: 'border-lime-600 text-lime-600 hover:bg-lime-700',
  yellow: 'border-yellow-600 text-yellow-600 hover:bg-yellow-700',
  green: 'border-green-600 text-green-600 hover:bg-green-700',
  emerald: 'border-emerald-600 text-emerald-600 hover:bg-emerald-700',
};

const StyledButton = ({ to, label, variant = 'amber' }) => {
  return (
    <Link
      to={to}
      className={clsx(
        'inline-block border px-4 py-2 rounded transition duration-200 shadow-sm',
        variantClasses[variant]
      )}
    >
      {label}
    </Link>
  );
};

export default StyledButton;