import dynamoDb from "../../libs/dynamodb-lib";
import * as uuid from "uuid";

export default {
  getProductReviews: (productId) => {
    return new Promise(async (resolve, reject) => {
      const getProductReviewsParams = {
            TableName: process.env.reviewTable,
            KeyConditionExpression:
              'productId = :productId',
            ExpressionAttributeValues: {
              ':productId': productId,
            },
          };
      try{
        const getProductReviewsResult = await dynamoDb.query(getProductReviewsParams);
        const productReviews = getProductReviewsResult.Items || {};
        resolve(productReviews);
      }catch(error){
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
          rating: rating
        },
      };
      try{
        await dynamoDb.put(addProductReviewParams);
        const productReview = addProductReviewParams.Item;
        resolve(productReview);
      }catch(error){
          reject(error);
      }
    });
  }
};