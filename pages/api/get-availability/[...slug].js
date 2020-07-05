import axios from 'axios'
import DbClient from '../../../lib/dbClient'
import * as moment from 'moment'

const ikeaApi = axios.create({
  baseURL: 'https://iows.ikea.com/retail/iows',
  headers: {
    authority: 'iows.ikea.com',
    accept: 'application/vnd.ikea.iows+json;version=1.0',
    contract: '37249',
    consumer: 'MAMMUT',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
    origin: 'https://www.ikea.com',
    'sec-fetch-site': 'same-site',
    'sec-fetch-mode': 'cors',
    'sec-fetch-dest': 'empty',
    referer: 'https://www.ikea.com/us/en/p/alex-desk-white-40260717/',
    'accept-language': 'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7',
    //'if-modified-since':'Thu, 25 Jun 2020 04:45:46 GMT',
  }
});

const dbClient = DbClient();

async function getAvailabilityBulk(country, stores, product) {
  const response = []
  const requests = []

  const buildKey = (product, store) => (`${product}-${store}`)

  for (const store of stores) {
    const data = await dbClient.getProduct({ Id: buildKey(product, store) })
    let useCache = !!data
    if (data) {
      const updatedAt = moment.unix(data.UpdatedAt)
      const now = moment()
      const diffSeconds = now.diff(updatedAt, 'seconds')

      if (diffSeconds > 120) useCache = false
    }

    if (useCache) {
      response.push(data)
      console.log('cache hit')
    } else {
      requests.push(ikeaApi.get(`/${country}/en/stores/${store}/availability/ART/${product}`))
      console.log('service hit')
    }
  }

  if (!requests.length) return response

  return await axios
    .all(requests)
    .then(
      axios.spread((...results) => {
        for (const result of results) {
          const stockAvailability = result.data.StockAvailability
          const retailItemAvailability = stockAvailability.RetailItemAvailability
          const availableStockForecast = stockAvailability.AvailableStockForecastList.AvailableStockForecast

          const resData = {
            store: stockAvailability.ClassUnitKey.ClassUnitCode.$,
            product: stockAvailability.ItemKey.ItemNo.$,
            availableNow: retailItemAvailability.AvailableStock.$,
            stockForecast: [],
            availabilityInfo: [],
          }

          // Forecast
          for (let forecast of availableStockForecast) {
            resData.stockForecast.push({
              stock: forecast.AvailableStock.$,
              type: forecast.AvailableStockType.$,
              probability: forecast.InStockProbabilityCode.$,
              datetime: forecast.ValidDateTime.$
            })
          }

          // Additional Messages
          if (retailItemAvailability.StockAvailabilityInfoList) {
            if (Array.isArray(retailItemAvailability.StockAvailabilityInfoList.StockAvailabilityInfo)) {
              for (let availabilityInfo of retailItemAvailability.StockAvailabilityInfoList.StockAvailabilityInfo) {
                resData.availabilityInfo.push(availabilityInfo.StockAvailInfoText.$)
              }
            }
          }

          response.push(resData)
          resData.Id = buildKey(resData.product, resData.store)
          resData.UpdatedAt = moment().unix()
          dbClient.putProduct(resData)
        }

        return response
      })
    )
}

export default async (req, res) => {
  const {
    query: { slug },
  } = req
  const country = slug[0]
  const stores = slug[1].split(',')
  const product = slug[2]
  const data = await getAvailabilityBulk(country, stores, product)
  res.status(200).json({ data })
}
