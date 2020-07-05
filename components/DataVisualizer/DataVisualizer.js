import { useContext } from 'react'
import styles from './DataVisualizer.module.css';
import { DataContext } from '../data.context';

const DataVisualizer = (props) => {
  const { data } = useContext(DataContext)

  return (
    <div className={styles.DataVisualizer}>
      <span className={styles.label}>Available Now</span>
      <span className={styles.AvailableNow}>{data.data[0].availableNow}</span>
    </div>
  )
}

export default DataVisualizer;