import styles from './Loading.module.css'
import Aux from '../../../hoc/Aux/Aux'
import Backdrop from '../Backdrop/Backdrop'

const Loading = (props) => {
  return (
    <Aux>
      <Backdrop show={props.show} modalClosed={props.modalClosed} />
      <div
        className={styles.Loading}
        style={{
          transform: props.show ? 'translateY(0)' : 'translateY(-100vh)',
          opacity: props.show ? '1' : '0'
        }}>
        <div className={styles['lds-ellipsis']}><div></div><div></div><div></div><div></div></div>
      </div>
    </Aux>
  )
}
export default React.memo(Loading)