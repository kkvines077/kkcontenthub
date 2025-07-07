import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Checkout({ cart }) {
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    zip: '',
    country: ''
  });
  const navigate = useNavigate();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    // Redirect to Razorpay payment link
    window.location.href = 'https://razorpay.me/@chorbazar3752';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can add logic to save the address to the backend
    handlePayment();
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Checkout</h2>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
            <div className="mb-4">
              <label className="block text-gray-700">Street</label>
              <input
                type="text"
                name="street"
                value={address.street}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                name="city"
                value={address.city}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">State</label>
              <input
                type="text"
                name="state"
                value={address.state}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">ZIP Code</label>
              <input
                type="text"
                name="zip"
                value={address.zip}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Country</label>
              <input
                type="text"
                name="country"
                value={address.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <button type="submit" className="w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Proceed to Payment
            </button>
          </form>
        </div>
        <div className="md:w-1/2">
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="bg-white p-6 rounded-lg shadow-md">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between mb-2">
                <span>{item.name} (x{item.quantity})</span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}
            <div className="flex justify-between font-bold mt-4">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
