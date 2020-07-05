import styles from './Table.module.css';
import Aux from '../../../hoc/Aux/Aux'

const table = (props) => {

  return (
    <div
      className={[styles.Rtable, styles['Rtable--3cols']].join(' ')}>
      {props.data.map(rowData => {
        return (
          <Aux key={rowData[0]}>
            <div className={styles['Rtable-cell']}><b>{rowData[0]}</b></div>
            <div className={styles['Rtable-cell']}>{rowData[1]}</div>
            <div className={styles['Rtable-cell']}>{rowData[2]}</div>
          </Aux>
        )
      })}
    </div>
  )
}

export default table;