import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { useStore } from './store';
import { MapPin, Clock, Tag, X } from 'lucide-react';

function App() {
  const { currentUser, items, users, login, register, addItem } = useStore();
  const [isLogin, setIsLogin] = useState(true);
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [itemFormData, setItemFormData] = useState({
    title: '',
    description: '',
    category: 'electronics',
    price: '',
    originalPrice: '',
    type: 'rent',
    isBiddingEnabled: false,
    images: [''],
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      const success = login(formData.email, formData.password);
      if (!success) {
        setError('Invalid email or password');
      }
    } else {
      if (!formData.name || !formData.email || !formData.password) {
        setError('All fields are required');
        return;
      }
      const success = register(formData.name, formData.email, formData.password);
      if (!success) {
        setError('Email already exists');
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemFormData.title || !itemFormData.description || !itemFormData.price) {
      setError('Title, description, and price are required');
      return;
    }

    addItem({
      title: itemFormData.title,
      description: itemFormData.description,
      category: itemFormData.category,
      price: parseFloat(itemFormData.price),
      originalPrice: itemFormData.originalPrice ? parseFloat(itemFormData.originalPrice) : undefined,
      type: itemFormData.type as 'rent' | 'sell',
      isBiddingEnabled: itemFormData.isBiddingEnabled,
      images: [itemFormData.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'],
      location: {
        lat: Math.random() * 180 - 90,
        lng: Math.random() * 360 - 180,
      },
    });

    setShowNewItemForm(false);
    setItemFormData({
      title: '',
      description: '',
      category: 'electronics',
      price: '',
      originalPrice: '',
      type: 'rent',
      isBiddingEnabled: false,
      images: [''],
    });
  };

  const getUser = (userId: string) => {
    return users.find((u) => u.id === userId);
  };

  return (
    <Layout>
      {!currentUser ? (
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-center mb-8">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            )}
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            <p className="text-center text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                  setFormData({ name: '', email: '', password: '' });
                }}
                className="text-indigo-600 hover:text-indigo-800"
              >
                {isLogin ? 'Sign up' : 'Login'}
              </button>
            </p>
          </form>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Items</h2>
            <button
              onClick={() => setShowNewItemForm(true)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              List New Item
            </button>
          </div>

          {showNewItemForm && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg p-8 max-w-md w-full relative">
                <button
                  onClick={() => setShowNewItemForm(false)}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
                <h3 className="text-xl font-bold mb-4">List New Item</h3>
                <form onSubmit={handleItemSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Title"
                    value={itemFormData.title}
                    onChange={(e) => setItemFormData({ ...itemFormData, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <textarea
                    placeholder="Description"
                    value={itemFormData.description}
                    onChange={(e) => setItemFormData({ ...itemFormData, description: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                    rows={3}
                  />
                  <select
                    value={itemFormData.category}
                    onChange={(e) => setItemFormData({ ...itemFormData, category: e.target.value })}
                    className="w-full px-4 py-2 border rounded-md"
                  >
                    <option value="electronics">Electronics</option>
                    <option value="tools">Tools</option>
                    <option value="sports">Sports</option>
                    <option value="books">Books</option>
                    <option value="other">Other</option>
                  </select>
                  <div className="flex gap-4">
                    <input
                      type="number"
                      placeholder="Price"
                      value={itemFormData.price}
                      onChange={(e) => setItemFormData({ ...itemFormData, price: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                    <input
                      type="number"
                      placeholder="Original Price (optional)"
                      value={itemFormData.originalPrice}
                      onChange={(e) => setItemFormData({ ...itemFormData, originalPrice: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md"
                    />
                  </div>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={itemFormData.type === 'rent'}
                        onChange={() => setItemFormData({ ...itemFormData, type: 'rent' })}
                        className="mr-2"
                      />
                      Rent
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        checked={itemFormData.type === 'sell'}
                        onChange={() => setItemFormData({ ...itemFormData, type: 'sell' })}
                        className="mr-2"
                      />
                      Sell
                    </label>
                  </div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={itemFormData.isBiddingEnabled}
                      onChange={(e) => setItemFormData({ ...itemFormData, isBiddingEnabled: e.target.checked })}
                      className="mr-2"
                    />
                    Enable Bidding
                  </label>
                  <input
                    type="url"
                    placeholder="Image URL"
                    value={itemFormData.images[0]}
                    onChange={(e) => setItemFormData({ ...itemFormData, images: [e.target.value] })}
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                  >
                    List Item
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => {
              const owner = getUser(item.userId);
              const discount = item.originalPrice
                ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={item.images[0] || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-semibold">{item.title}</h3>
                      {discount > 0 && (
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          {discount}% OFF
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1">{item.description}</p>
                    
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center text-gray-500">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span>2.5 miles away</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{item.type === 'rent' ? 'For Rent' : 'For Sale'}</span>
                      </div>
                      <div className="flex items-center text-gray-500">
                        <Tag className="w-4 h-4 mr-2" />
                        <div className="flex items-center gap-2">
                          {item.originalPrice && (
                            <span className="line-through text-sm">${item.originalPrice}</span>
                          )}
                          <span className="font-semibold text-indigo-600">
                            {item.isBiddingEnabled
                              ? `Current Bid: $${item.currentBid || item.price}`
                              : `$${item.price}`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {owner?.name.charAt(0)}
                          </span>
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          {owner?.name}
                        </span>
                      </div>
                      <button className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </Layout>
  );
}

export default App;