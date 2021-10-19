import dynamoDb from "../../libs/dynamodb-lib";
import * as uuid from "uuid";

export default {
  getProductReviews: (productId) => {
    return new Promise(async (resolve, reject) => {
      const getProductReviewsParams = {
        TableName: process.env.reviewTable,
        IndexName: "lastUpdatedTimeIndex",
        KeyConditionExpression: "productId = :productId",
        ExpressionAttributeValues: {
          ":productId": productId,
        },
        ScanIndexForward: false,
      };
      try {
        const getProductReviewsResult = await dynamoDb.query(
          getProductReviewsParams
        );
        const productReviews = getProductReviewsResult.Items || {};
        resolve(productReviews);
      } catch (error) {
        reject(error);
      }
    });
  },
  addProductReview: (productId, rating, reviewText) => {
    return new Promise(async (resolve, reject) => {
      const addProductReviewParams = {
        TableName: process.env.reviewTable,
        Item: {
          productId: productId,
          reviewId: uuid.v4(),
          reviewText: reviewText,
          rating: rating,
          lastUpdatedTime: new Date().toISOString(),
        },
      };
      try {
        await dynamoDb.put(addProductReviewParams);
        const productReview = addProductReviewParams.Item;
        resolve(productReview);
      } catch (error) {
        reject(error);
      }
    });
  },
  addSocketConnection: (connectionId) => {
    return new Promise(async (resolve, reject) => {
      const addSocketConnectionParams = {
        TableName: process.env.connectionTable,
        Item: {
          connectionId: connectionId,
        },
      };
      try {
        await dynamoDb.put(addSocketConnectionParams);
        resolve({ message: "Connection added succesfully" });
      } catch (error) {
        reject(error);
      }
    });
  },
  removeSocketConnection: (connectionId) => {
    return new Promise(async (resolve, reject) => {
      const removeSocketConnectionParams = {
        TableName: process.env.connectionTable,
        Key: {
          connectionId: connectionId,
        },
      };
      try {
        await dynamoDb.delete(removeSocketConnectionParams);
        resolve({ message: "Connnection removed succesfully" });
      } catch (error) {
        reject(error);
      }
    });
  },
  getAllConnections: () => {
    return new Promise(async (resolve, reject) => {
      const getAllConnectionsParams = {
        TableName: process.env.connectionTable,
      };
      try {
        const getAllConnectionsResult = await dynamoDb.scan(
          getAllConnectionsParams
        );
        const allConnections = getAllConnectionsResult.Items || [];
        resolve(allConnections);
      } catch (error) {
        reject(error);
      }
    });
  },
};
