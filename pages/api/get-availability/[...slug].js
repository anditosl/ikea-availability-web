import axios from 'axios'

const ikeaApi = axios.create({
	baseURL: 'https://iows.ikea.com/retail/iows',
	headers: {
		authority:'iows.ikea.com',
		accept:'application/vnd.ikea.iows+json;version=1.0',
		contract:'37249',
		consumer:'MAMMUT',
		'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36',
		origin:'https://www.ikea.com',
		'sec-fetch-site':'same-site',
		'sec-fetch-mode':'cors',
		'sec-fetch-dest':'empty',
		referer:'https://www.ikea.com/us/en/p/alex-desk-white-40260717/',
		'accept-language':'en-US,en;q=0.9,es-US;q=0.8,es;q=0.7',
		//'if-modified-since':'Thu, 25 Jun 2020 04:45:46 GMT',
	}
});

async function getAvailabilityBulk(country, stores, product) {
  const requests = []
  for (const store of stores) {
    requests.push(ikeaApi.get(`/${country}/en/stores/${store}/availability/ART/${product}`))
  }

  return await axios
  .all(requests)
  .then(
    axios.spread((...responses) => {
        const data = []

        for (const response of responses) {
          const stockAvailability = response.data.StockAvailability
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

          data.push(resData)
        }

        return data
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
