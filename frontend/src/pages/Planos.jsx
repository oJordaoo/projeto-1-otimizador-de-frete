import React from 'react';
import SimpleHeader from '../components/SimpleHeader';
import PlanosGrid from '../components/PlanosGrid'; // Importa a grade
import './Planos.css';

const Planos = () => {
  return (
    <> 
      <SimpleHeader />
      <PlanosGrid /> {/* Usa a grade de planos */}
    </>
  );
};

export default Planos;