import { useState } from 'react';
import axios from 'axios';
import { states } from '../utils/states.utils';
import axiosInstance from '../api/axiosInstance';

interface Dimensions {
  clientName: string;
  width: number;
  length: number;
  height: number;
}

interface Result {
  totalValue: number;
  tonnage: number;
}

interface ClientAreaProps {
  dimensions: Dimensions;
  result: Result | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
}

interface CalculationResponse {
  totalValue: number;
  tonnage: number;
}

const ClientArea = () => {
  const [dimensions, setDimensions] = useState({
    clientName: '',
    width: '',
    length: '',
    height: '',
    state: 'SP',
  });
  const [result, setResult] = useState<{
    totalValue: number;
    tonnage: number;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDimensions({ ...dimensions, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post('calculate', {
        ...dimensions,
        width: parseFloat(dimensions.width),
        length: parseFloat(dimensions.length),
        height: parseFloat(dimensions.height),
      });
      setResult(response.data as CalculationResponse);
    } catch (error: any) {
      alert('Erro ao calcular projeto');
    }
  };

  return (
    <div className='min-h-screen p-6 bg-gray-50'>
      <h2 className='text-2xl font-bold mb-4'>Área do Cliente - Cosmos 3D</h2>
      <form
        onSubmit={handleSubmit}
        className='bg-white p-6 rounded shadow-md max-w-md'
      >
        <div className='mb-4'>
          <label className='block mb-1'>Nome do Cliente:</label>
          <input
            type='text'
            name='clientName'
            value={dimensions.clientName}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Largura (m):</label>
          <input
            type='number'
            name='width'
            value={dimensions.width}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Comprimento (m):</label>
          <input
            type='number'
            name='length'
            value={dimensions.length}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Altura (m):</label>
          <input
            type='number'
            name='height'
            value={dimensions.height}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Estado:</label>
          <select
            name='state'
            value={dimensions.state}
            onChange={handleChange}
            className='border p-2 w-full'
          >
            {states.map((st) => (
              <option key={st.value} value={st.value}>
                {st.label}
              </option>
            ))}
          </select>
        </div>
        <button
          type='submit'
          className='bg-green-500 text-white py-2 px-4 rounded'
        >
          Calcular
        </button>
      </form>
      {result && (
        <div className='mt-6 bg-white p-4 rounded shadow-md max-w-md'>
          <h3 className='text-xl font-semibold'>Resultado:</h3>
          <p>Valor do Projeto: R$ {result.totalValue}</p>
          <p>Tonalagem: {result.tonnage} toneladas</p>
        </div>
      )}
    </div>
  );
};

export default ClientArea;
