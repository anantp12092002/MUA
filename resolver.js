const { UUID } = require('bson');
const Customer = require('./models/customer');
const Order = require('./models/order');
const Product = require('./models/product');
const mongoose = require('mongoose')
const GraphQLJSON = require("graphql-type-json");

const resolvers = {
  Query: {
    // Query 1: Get Customer Spending
    getCustomerSpending: async (_, { customerId }) => {
        const ordersnew = await Order.find({});
      const orders = await Order.aggregate([
        { $match: { customerId: new UUID(customerId) } },
        { $group: {
          _id: "$customerId",
          totalSpent: { $sum: "$totalAmount" },
          averageOrderValue: { $avg: "$totalAmount" },
          lastOrderDate: { $max: "$orderDate" }
        }}
      ]);

      const customer = orders[0];
      return {
        customerId,
        totalSpent: customer.totalSpent,
        averageOrderValue: customer.averageOrderValue,
        lastOrderDate: customer.lastOrderDate,
      };
    },

    // Query 2: Get Top Selling Products
    getTopSellingProducts: async (_, { limit }) => {
      const productsSold = await Order.aggregate([
        { $unwind: "$products" },
        { $group: {
          _id: "$products.productId",
          totalSold: { $sum: "$products.quantity" }
        }},
        { $sort: { totalSold: -1 } },
        { $limit: limit },
        { $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product"
        }},
        { $unwind: "$product" },
        { $project: {
          productId: "$_id",
          name: "$product.name",
          totalSold: 1
        }}
      ]);
      return productsSold;
    },

    // Query 3: Get Sales Analytics
    getSalesAnalytics: async (_, { startDate, endDate }) => {
      const sales = await Order.aggregate([
        {
          $match: {
            status: "completed"
          }
        },
        {
          $addFields: {
            parsedProducts: {
              $function: {
                body: function (products) {
                  const validJsonString =
                    products.replace(/'/g, '"');
                  const jsonObject = JSON.parse(
                    validJsonString
                  );
                  for (let ob of jsonObject) {
                    let binaryUUID = new UUID(
                      ob.productId
                    );
                    ob.productId = binaryUUID;
                  }
                  return jsonObject;
                },
                args: ["$products"],
                lang: "js"
              }
            }
          }
        },
        {
          $unwind: "$parsedProducts"
        },
        {
          $lookup: {
            from: "products",
            localField: "parsedProducts.productId",
            foreignField: "_id",
            as: "productDetails"
          }
        },
        {
          $unwind: "$productDetails"
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalAmount" },
            completedOrders: { $sum: 1 },
            products: {
              $push: "$productDetails.category"
            }
          }
        },
        {
          $unwind: "$products"
        },
        {
          $group: {
            _id: "$products",
            totalRevenue: { $sum: "$totalRevenue" },
            completedOrders: {
              $sum: "$completedOrders"
            },
            categoryBreakdown: {
              $push: {
                category: "$products",
                revenue: "$totalRevenue"
              }
            }
          }
        }
      ]);

      return sales;
    },
  },
};

module.exports = resolvers;
