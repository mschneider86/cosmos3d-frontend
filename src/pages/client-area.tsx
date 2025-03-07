import { useState } from 'react';
import { states } from '../utils/states.utils';
import axiosInstance from '../api/axiosInstance';

interface Dimensions {
  clientName: string;
  area: string; // Área em m² (informada pelo usuário)
  wallHeight: string; // Altura das paredes (m)
  wallLength: string; // Comprimento das paredes (m)
  state: string;
}

interface Result {
  totalWeight: number; // Peso Total em toneladas
  wallPrice: number; // Valor das Paredes (R$)
  pricePerM2: number; // Valor por m² (R$)
}

interface CalculationResponse {
  totalWeight: number;
  wallPrice: number;
  pricePerM2: number;
}

const ClientArea = () => {
  const [dimensions, setDimensions] = useState<Dimensions>({
    clientName: '',
    area: '',
    wallHeight: '',
    wallLength: '',
    state: 'SP',
  });

  const [result, setResult] = useState<Result | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setDimensions({ ...dimensions, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post<CalculationResponse>(
        'calculate',
        {
          ...dimensions,
          area: parseFloat(dimensions.area),
          wallHeight: parseFloat(dimensions.wallHeight),
          wallLength: parseFloat(dimensions.wallLength),
        }
      );
      setResult(response.data);
    } catch (error: any) {
      alert('Erro ao calcular projeto');
    }
  };

  return (
    <div className='min-h-screen p-6 bg-gray-200 text-gray-800'>
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
          <label className='block mb-1'>Área (m²):</label>
          <input
            type='number'
            name='area'
            value={dimensions.area}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Altura das Paredes (m):</label>
          <input
            type='number'
            name='wallHeight'
            value={dimensions.wallHeight}
            onChange={handleChange}
            required
            className='border p-2 w-full'
          />
        </div>
        <div className='mb-4'>
          <label className='block mb-1'>Comprimento das Paredes (m):</label>
          <input
            type='number'
            name='wallLength'
            value={dimensions.wallLength}
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
          <h3 className='text-xl font-semibold mb-2'>Resultado:</h3>
          <p className='mb-2'>
            <strong>Peso Total:</strong>{' '}
            {result.totalWeight?.toFixed(2) ?? '0.00'} toneladas
          </p>
          <div className='border-t pt-4'>
            <h4 className='text-lg font-bold mb-1'>Estimativa de Preço</h4>
            <p className='mb-1'>
              <strong>Valor das Paredes:</strong> R${' '}
              {result.wallPrice?.toFixed(2) ?? '0.00'}
            </p>
            <p>
              <strong>Valor por m²:</strong> R${' '}
              {result.pricePerM2?.toFixed(2) ?? '0.00'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClientArea;
