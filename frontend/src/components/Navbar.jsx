import { Link } from 'react-router-dom';

function Navbar({ cartCount }) {
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">ChorBazar</Link>
        <div className="space-x-4">
          <Link to="/products" className="hover:text-blue-200">Products</Link>
          <Link to="/upload" className="hover:text-blue-200">Upload Product</Link>
          <Link to="/cart" className="hover:text-blue-200">Cart ({cartCount})</Link>
          <Link to="/login" className="hover:text-blue-200">Login</Link>
          <Link to="/signup" className="hover:text-blue-200">Signup</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
