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
    const sqlAsync = (query) =>
      new Promise((resolve, reject) => {
        mysqlConnection.query(query, (err, rows) => {
          if (err) reject(err);
          else resolve(rows);
        });
      });

   
    const dailyRevenueSQL = `
      SELECT DATE(createdAt) AS date, SUM(total) AS revenue
      FROM orders GROUP BY DATE(createdAt)
      ORDER BY DATE(createdAt) DESC;
    `;
    const dailyRevenueRows = await sqlAsync(dailyRevenueSQL);

    const dailyRevenue = dailyRevenueRows.map(r => ({
      date: r.date,
      revenue: `₹${r.revenue.toFixed(2)}`
    }));

    const topCustomersSQL = `
      SELECT users.name, COUNT(orders.id) AS totalOrders, SUM(orders.total) AS totalSpent
      FROM orders
      JOIN users ON orders.userId = users.id
      GROUP BY users.id
      ORDER BY totalSpent DESC;
    `;
    const topCustomerRows = await sqlAsync(topCustomersSQL);

    const topCustomers = topCustomerRows.map(r => ({
      name: r.name,
      orders: r.totalOrders,
      spent: `₹${r.totalSpent.toFixed(2)}`
    }));

    const categorySalesRaw = await Product.aggregate([
      {
        $lookup: {
          from: "order_items",
          localField: "_id",
          foreignField: "productId",
          as: "sales"
        }
      },
      { $unwind: "$sales" },
      {
        $group: {
          _id: "$category",
          totalSales: { $sum: "$sales.priceAtPurchase" },
          itemsSold: { $sum: "$sales.quantity" },
          avgPrice: { $avg: "$price" }
        }
      }
    ]);

    const categorySales = categorySalesRaw.map(c => ({
      category: c._id,
      totalSales: `₹${c.totalSales.toFixed(2)}`,
      itemsSold: c.itemsSold,
      avgPrice: `₹${c.avgPrice.toFixed(2)}`
    }));

    res.status(200).json({
      dailyRevenue,
      topCustomers,
      categorySales
    });

  } catch (error) {
    res.status(500).json({
      message: "Error generating admin dashboard",
      error: error.message
    });
  }
};