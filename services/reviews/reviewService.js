import dynamoDb from "../../libs/dynamodb-lib";

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
  }
};