import dynamoDb from "../../libs/dynamodb-lib";

export default {
  getProduct: (productId, fetchReviews) => {
    return new Promise(async (resolve, reject) => {
      const getProductParams = {
            TableName: process.env.tableName,
            KeyConditionExpression:
              'productId = :productId',
            ExpressionAttributeValues: {
              ':productId': productId,
            },
          };
      try{
        const productDetails = await dynamoDb.query(getProductParams);
        if(!fetchReviews){
          resolve(productDetails.Item || {});
        }else{
          // fetch product reviews using review service
        }
      }catch(error){
          reject(error);
      }
    });
  }
}