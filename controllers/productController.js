const Product = require('../models/Product');
const { rawListeners } = require('../server');
const mysqlConnection = require('../config/mysqlConnection');
// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const id = req.query?.sort;
    const products = await Product.find().sort((id === "asc") ? { price: 1 } : { price: -1 }); 
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching products",
      error: error.message,
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: 'Error creating product', error });
  }
};


// Update product (Admin)
exports.updateProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Error updating product",
      error: error.message,
    });
  }
};

// Delete product (Admin)
exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(id);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting product",
      error: error.message,
    });
  }
};



// // Daily Revenue

// exports.getDailyRevenue = (req, res) => {
//   const sql = `
//     SELECT 
//       DATE(createdAt) AS date,
//       SUM(total) AS revenue
//     FROM orders
//     GROUP BY DATE(createdAt)
//     ORDER BY DATE(createdAt) DESC;
//   `;

//   mysqlConnection.query(sql, (err, rows) => {
//     if (err) {
//       return res.status(500).json({ message: "SQL error (daily revenue)", error: err });
//     }

//     const formatted = rows.map(r => ({
//       date: r.date,
//       revenue: `₹${r.revenue.toFixed(2)}`
//     }));

//     res.status(200).json({
//       title: "Daily Revenue",
//       data: formatted
//     });
//   });
// };


// //Top Customers

// exports.getTopCustomers = (req, res) => {
//   const sql = `
//     SELECT 
//       users.name,
//       COUNT(orders.id) AS totalOrders,
//       SUM(orders.total) AS totalSpent
//     FROM orders
//     JOIN users ON orders.userId = users.id
//     GROUP BY users.id
//     ORDER BY totalSpent DESC
//     LIMIT 10;
//   `;

//   mysqlConnection.query(sql, (err, rows) => {
//     if (err) {
//       return res.status(500).json({ message: "SQL error (top customers)", error: err });
//     }

//     const formatted = rows.map(r => ({
//       name: r.name,
//       orders: r.totalOrders,
//       spent: `₹${r.totalSpent.toFixed(2)}`
//     }));

//     res.status(200).json({
//       title: "Top Customers",
//       data: formatted
//     });
//   });
// };


// //Sales by Category
// exports.getSalesByCategory = async (req, res) => {
//   try {
//     const result = await Product.aggregate([
//       {
//         $lookup: {
//           from: "order_items",
//           localField: "_id",
//           foreignField: "productId",
//           as: "sales"
//         }
//       },
//       { $unwind: "$sales" },
//       {
//         $group: {
//           _id: "$category",
//           totalSales: { $sum: "$sales.priceAtPurchase" },
//           itemsSold: { $sum: "$sales.quantity" },
//           avgPrice: { $avg: "$price" }
//         }
//       },
//       { $sort: { totalSales: -1 } }
//     ]);

//     const formatted = result.map(c => ({
//       category: c._id,
//       totalSales: `₹${c.totalSales.toFixed(2)}`,
//       itemsSold: c.itemsSold,
//       avgPrice: `₹${c.avgPrice.toFixed(2)}`
//     }));

//     res.status(200).json({
//       title: "Sales by Category",
//       data: formatted
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: "MongoDB error (category sales)",
//       error: error.message
//     });
//   }
// };



// Combined Admin Dashboard

exports.adminDashboard = async (req, res) => {
  try {
    const sqlAsync = (query, values = []) =>
      new Promise((resolve, reject) => {
        mysqlConnection.query(query, values, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

  
    const dailyRevenueRows = await sqlAsync(`
      SELECT DATE(createdAt) AS date, SUM(total) AS revenue
      FROM orders 
      GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt) DESC;
    `);

    const dailyRevenue = dailyRevenueRows.map(r => ({
      date: r.date,
      revenue: `₹${Number(r.revenue).toFixed(2)}`
    }));

   
    const topCustomerRows = await sqlAsync(`
      SELECT users.name, COUNT(orders.id) AS totalOrders, SUM(orders.total) AS totalSpent
      FROM orders
      JOIN users ON orders.userId = users.id
      GROUP BY users.id
      ORDER BY totalSpent DESC;
    `);

    const topCustomers = topCustomerRows.map(r => ({
      name: r.name,
      orders: r.totalOrders,
      spent: `₹${Number(r.totalSpent).toFixed(2)}`
    }));

 
    const orderItems = await sqlAsync(`
      SELECT productId, quantity, priceAtPurchase
      FROM order_items;
    `);

    if (orderItems.length === 0) {
      return res.status(200).json({
        dailyRevenue,
        topCustomers,
        categorySales: []
      });
    }

    const productIds = orderItems.map(item => item.productId);

    const mongoProducts = await Product.find(
      { _id: { $in: productIds } },
      { category: 1, price: 1 }
    );

    const productMap = {};
    mongoProducts.forEach(p => {
      productMap[p._id.toString()] = p;
    });

    const categoryMap = {};

    for (const item of orderItems) {
      const productId = item.productId;
      const product = productMap[productId];

      if (!product) continue; 
      const cat = product.category;

      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          category: cat,
          totalSales: 0,
          itemsSold: 0,
          totalPrice: 0,
          priceCount: 0
        };
      }

      categoryMap[cat].totalSales += item.priceAtPurchase * item.quantity;
      categoryMap[cat].itemsSold += item.quantity;
      categoryMap[cat].totalPrice += product.price;
      categoryMap[cat].priceCount += 1;
    }

    const categorySales = Object.values(categoryMap).map(c => ({
      category: c.category,
      totalSales: `₹${c.totalSales.toFixed(2)}`,
      itemsSold: c.itemsSold,
      avgPrice: `₹${(c.totalPrice / c.priceCount).toFixed(2)}`
    }));

    res.status(200).json({
      dailyRevenue,
      topCustomers,
      categorySales
    });

  } catch (error) {
    console.error("Dashboard Error:", error);
    res.status(500).json({
      message: "Error generating admin dashboard",
      error: error.message
    });
  }
};