/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import { Container } from './styles';
import { Button, Error } from '..';
import { api } from '../../services/api';
import StatusScreen from '../StatusScreen';

function Modal({
  plate,
  message,
  butttonMessage,
  operationType,
  handleCloseModal,
}) {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sucess, setSucess] = useState(false);

  async function handleSubmit(event) {
    setLoading(true);
    event.preventDefault();
    try {
      const res = await api.post(`/parking/${plate}/${operationType}`);
      if (res.status === 204) setSucess(true);
    } catch (err) {
      if (operationType === 'pay')
        setError('Estacionamento já pago ou carro não estacionado.');
      if (operationType === 'out') setError('Carro não estacionado.');
    } finally {
      setLoading(false);
      setTimeout(() => {
        setSucess(false);
        handleCloseModal();
      }, 3000);
    }
  }

  return (
    <Container>
      (
      {!loading && !sucess && (
        <form onSubmit={handleSubmit}>
          <p>{message}</p>
          <span className="plate">{plate}</span>
          {error && <Error errorMessage={error} />}
          <Button color="purple" plate={plate}>
            {butttonMessage}
          </Button>
          <a onClick={() => handleCloseModal()}>VOLTAR</a>
        </form>
      )}
      ){loading && !sucess && <StatusScreen typeAnimation="loading" />}
      {!loading && sucess && <StatusScreen typeAnimation="sucess" />}
    </Container>
  );
}

export default Modal;
