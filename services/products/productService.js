import dynamoDb from "../../libs/dynamodb-lib";
import reviewService from '../reviews/reviewService';

export default {
  getProduct: (productId, fetchReviews) => {
    return new Promise(async (resolve, reject) => {
      const getProductParams = {
          TableName: process.env.productTable,
            Key: {
              productId: productId
            }
          };
      try{
        const getProductResult = await dynamoDb.get(getProductParams);
        const productDetails = getProductResult.Item || {};
        if(fetchReviews !== "true"){
          resolve(productDetails);
        }else{
          const productReviews = await reviewService.getProductReviews(productId);
          resolve({
            ...productDetails,
            reviews: productReviews
          });
        }
      }catch(error){
          reject(error);
      }
    });
  },
  getAllProducts: () => {
    return new Promise(async (resolve, reject) => {
      const getAllProductsParams = {
          TableName: process.env.productTable
          };
      try{
        const getAllProductsResult = await dynamoDb.scan(getAllProductsParams);
        const allProducts = getAllProductsResult.Items || [];
        resolve(allProducts);
      }catch(error){
          reject(error);
      }
    });
  }
};