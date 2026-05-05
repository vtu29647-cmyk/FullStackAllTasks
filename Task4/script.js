
    // Fetch Customer Order History
    fetch('http://localhost:3000/order-history')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('orderHistoryBody');
            tbody.innerHTML = '';
            data.forEach(order => {
                const row = `
                    <tr>
                        <td>${order.name}</td>
                        <td>${order.product_name}</td>
                        <td>${order.quantity}</td>
                        <td>₹${order.total_amount}</td>
                        <td>${new Date(order.order_date).toLocaleDateString()}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('orderHistoryBody').innerHTML = '<tr><td colspan="5">Error loading data</td></tr>';
        });

    // Fetch Highest Value Order
    fetch('http://localhost:3000/highest-order')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('highestOrderBody');
            tbody.innerHTML = '';
            data.forEach(order => {
                const totalValue = order.price * order.quantity;
                const row = `
                    <tr>
                        <td>${order.order_id}</td>
                        <td>${order.customer_id}</td>
                        <td>${order.product_id}</td>
                        <td>${order.product_name}</td>
                        <td>${order.quantity}</td>
                        <td>₹${order.price}</td>
                        <td>₹${totalValue}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('highestOrderBody').innerHTML = '<tr><td colspan="7">Error loading data</td></tr>';
        });

    // Fetch Most Active Customer
    fetch('http://localhost:3000/most-active-customer')
        .then(response => response.json())
        .then(data => {
            const tbody = document.getElementById('activeCustomerBody');
            tbody.innerHTML = '';
            data.forEach(customer => {
                const row = `
                    <tr>
                        <td>${customer.customer_id}</td>
                        <td>${customer.total_orders}</td>
                    </tr>
                `;
                tbody.innerHTML += row;
            });
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('activeCustomerBody').innerHTML = '<tr><td colspan="2">Error loading data</td></tr>';
        });
