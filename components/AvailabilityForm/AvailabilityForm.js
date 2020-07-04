import { useState } from 'react'
import axios from 'axios'
import Aux from '../../hoc/Aux/Aux'
import Loading from '../UI/Loading/Loading'
import styles from './AvailabilityForm.module.css'

const AvailabilityForm = (props) => {
  const [formData, setFormData] = useState({
    country: 'us',
    stores: '',
    product: '40260717',
  });

  const [loading, setLoading] = useState(false)

  const updateFormData = event =>
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    });

  const { country, stores, product } = formData;

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true)
    const response = await axios.get(`/api/get-availability/${country}/${stores}/${product}`)
    console.log(response.data)
    setLoading(false)
  }

  const cancelHandler = () => {
    setLoading(false)
  }

  return (
    <Aux>
      <Loading show={loading} modalClosed={cancelHandler} />
      <form onSubmit={submitHandler} className={styles.Form}>
      <label>
          Country:
          <select name="country" value={country} onChange={e => updateFormData(e)} required>
            {props.countries
              .map(countryData => (
                <option value={countryData.code.toLowerCase()}>{countryData.name}</option>
              ))}
          </select>
        </label>
        <label>
          Stores:
          <select name="stores" value={stores} onChange={e => updateFormData(e)} required>
            {props.stores
              .filter(store => (store.countryCode === country))
              .map(storeData => (
                <option value={storeData.buCode}>{storeData.name}</option>
              ))}
          </select>
        </label>
        <label>
          Product:
          <input
            value={product}
            onChange={e => updateFormData(e)}
            placeholder="Type Product ID"
            type="text"
            name="product"
            required
          />
        </label>

        <button type="submit">Check Availability</button>
      </form>
    </Aux>
  );
};

export default AvailabilityForm;