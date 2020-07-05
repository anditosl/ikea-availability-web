import * as AWS from 'aws-sdk'

AWS.config.region = process.env.REGION || 'us-west-2'

AWS.config.update({
  region: process.env.REGION || 'us-west-2',
  endpoint: "http://localhost:8000"
});

const dbClient = () => {
  const ddb = new AWS.DynamoDB.DocumentClient()

  const ddbTable = process.env.STARTUP_SIGNUP_TABLE || 'Products'

  const putProduct = async (Item) => {
    const params = {
      TableName: ddbTable,
      Item,
    }

    try {
      const data = await ddb.put(params).promise()
      return data.Item
    } catch (err) {
      console.log('DDB Error on PUT: ' + err)
      // there is no data here, you can return undefined or similar
      return
    }
  }

  const getProduct = async (Key) => {
    const params = {
      TableName: ddbTable,
      Key,
    }

    try {
      const data = await ddb.get(params).promise()
      return data.Item
    } catch (err) {
      console.log('DDB Error on GET: ' + err)
      // there is no data here, you can return undefined or similar
      return
    }
  }

  return {
    getProduct,
    putProduct
  }
}

export default dbClient