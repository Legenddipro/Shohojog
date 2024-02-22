// Import necessary dependencies
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom'; // Import useHistory to navigate
import '../styles/Cart.scss'; // Import CSS styles

// Define your Cart component
const Cart = () => {
    // Define state variables using useState hook
    const [locations, setLocations] = useState([]);
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedProduct, setSelectedProduct] = useState('');
    const [selectedUser, setSelectedUser] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    // Define a history object using useHistory hook
    const history = useHistory();

    // Define useEffect hook to fetch data from backend API
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch data for locations
                const locationsResponse = await fetch('http://localhost:3000/locations');
                const locationsData = await locationsResponse.json();
                setLocations(locationsData);

                // Fetch data for users
                const usersResponse = await fetch('http://localhost:3000/users');
                const usersData = await usersResponse.json();
                setUsers(usersData);

                // Fetch data for products
                const productsResponse = await fetch('http://localhost:3000/products');
                const productsData = await productsResponse.json();
                setProducts(productsData);

                // Fetch data for orders
                const ordersResponse = await fetch('http://localhost:3000/orders');
                const ordersData = await ordersResponse.json();
                setOrders(ordersData);

                // Set isLoading to false once data is fetched
                setIsLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        // Call fetchData function
        fetchData();
    }, []);

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        // Perform actions based on form data
        // For example, navigate to a new page
        history.push('/confirmation'); // Navigate to confirmation page
    };

    // Render loading message if data is still loading
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Render the form to select location, user, and product
    return (
        <div className="cart-container">
            <h2>Place Order</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="location">Select Location:</label>
                    <select id="location" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                        {locations.map((location) => (
                            <option key={location.pst_code} value={location.pst_code}>
                                {location.street}, {location.area}, {location.town}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="user">Select User:</label>
                    <select id="user" value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)}>
                        {users.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.First_Name} {user.Middle_Name} {user.Last_Name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="product">Select Product:</label>
                    <select id="product" value={selectedProduct} onChange={(e) => setSelectedProduct(e.target.value)}>
                        {products.map((product) => (
                            <option key={product.Product_id} value={product.Product_id}>
                                {product.Product_name} - ${product.Price}
                            </option>
                        ))}
                    </select>
                </div>
                <button type="submit">Place Order</button>
            </form>
        </div>
    );
};

export default Cart;
