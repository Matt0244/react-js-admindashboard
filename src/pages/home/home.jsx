import React from 'react';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();

  return (
    <div >
      {/* Main Content */}
      <main >
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Add User */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Add User</h3>
            <p className="text-gray-600">Easily add a new user with a username, password, and role.</p>
            <button
              className="mt-4  bg-brand-dark text-white py-2 px-4 rounded"
              onClick={() => history.push('/user')}
            >
              Add User
            </button>
          </div>

          {/* Manage Categories */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Manage Categories</h3>
            <p className="text-gray-600">Update or add new product categories.</p>
            <button
              className="mt-4 bg-brand-dark text-white py-2 px-4 rounded"
              onClick={() => history.push('/category')}
            >
              Manage Categories
            </button>
          </div>

          {/* Product List */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Product List</h3>
            <p className="text-gray-600">View and manage all products in the store.</p>
            <button
              className="mt-4  bg-brand-dark text-white py-2 px-4 rounded"
              onClick={() => history.push('/product')}
            >
              View Products
            </button>
          </div>

          {/* Role Management */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Role Management</h3>
            <p className="text-gray-600">Set permissions for various roles.</p>
            <button
              className="mt-4  bg-brand-dark text-white py-2 px-4 rounded"
              onClick={() => history.push('/role')}
            >
              Manage Roles
            </button>
          </div>
        </div>

        {/* Action Table */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Function</h2>
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2">Functionality</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">User Management</td>
                <td className="border px-4 py-2">Add, update, or delete users.</td>
                <td className="border px-4 py-2">
                  <button
                    className=" bg-brand-dark text-white py-1 px-2 rounded"
                    onClick={() => history.push('/user')}
                  >
                    Go
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Product Management</td>
                <td className="border px-4 py-2">Manage all products in the catalog.</td>
                <td className="border px-4 py-2">
                  <button
                    className=" bg-brand-dark text-white py-1 px-2 rounded"
                    onClick={() => history.push('/product')}
                  >
                    Go
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Category Management</td>
                <td className="border px-4 py-2">Update product categories or add new ones.</td>
                <td className="border px-4 py-2">
                  <button
                    className=" bg-brand-dark text-white py-1 px-2 rounded"
                    onClick={() => history.push('/category')}
                  >
                    Go
                  </button>
                </td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Role Management</td>
                <td className="border px-4 py-2">Set permissions for user roles.</td>
                <td className="border px-4 py-2">
                  <button
                    className=" bg-brand-dark text-white py-1 px-2 rounded"
                    onClick={() => history.push('/role')}
                  >
                    Go
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default HomePage;