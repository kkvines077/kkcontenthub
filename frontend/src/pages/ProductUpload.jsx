import { useState } from 'react';
import axios from 'axios';

function ProductUpload() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/products', formData);
      alert('Product uploaded successfully!');
      setFormData({ name: '', description: '', price: '', image: '' });
    } catch (error) {
      console.error('Error uploading product:', error);
      alert('Failed to upload product.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold mb-6">Upload Product</h2>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Price</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Upload Product
        </button>
      </form>
    </div>
  );
}

export default ProductUpload;
