import { useContext, useState } from 'react'
import styles from './DataVisualizer.module.css';
import { DataContext } from '../data.context';
import Aux from '../../hoc/Aux/Aux'
import Modal from '../UI/Modal/Modal'
import Table from '../UI/Table/Table'

const DataVisualizer = (props) => {
  const { data } = useContext(DataContext)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const cancelHandler = () => {
    setIsModalOpen(false)
  }

  const clickHandler = () => {
    setIsModalOpen(true)
  }

  const store = props.stores.find((store) => (store.buCode == data.data[0].store)) || {}
  const country = props.countries.find((country) => (country.code.toLowerCase() == store.countryCode)) || {}

  return (
    <Aux>
      <Modal show={isModalOpen} modalClosed={cancelHandler}>
        <h1>Stock Forecast</h1>
        {data.data[0].stockForecast && data.data[0].stockForecast.length && (
          <Table data={data.data[0].stockForecast.map((forecastDay) => ([forecastDay.datetime, forecastDay.stock, forecastDay.probability]))} />
        )}
      </Modal>
      <div className={styles.DataVisualizer}>
        <span className={styles.label}>Available Now</span>
        <span className={styles.AvailableNow}>{data.data[0].availableNow}</span>
        <a className={styles.moreLink} onClick={clickHandler}>See Forecast</a>
      </div>
    </Aux>
  )
}

export default DataVisualizer;