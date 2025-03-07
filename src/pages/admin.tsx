import { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

interface Parameter {
  id: number;
  name: string;
  value: number;
}

interface ParameterResponse {
  id: number;
  name: string;
  value: number;
}

const Admin = () => {
  const [parameters, setParameters] = useState<Parameter[]>([]);
  const [newParam, setNewParam] = useState({ name: '', value: '' });
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const fetchParameters = async () => {
    try {
      const response = await axiosInstance.get(`parameters`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParameters(response.data as ParameterResponse[]);
    } catch (error) {
      alert('Erro ao carregar parâmetros');
    }
  };

  useEffect(() => {
    fetchParameters();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axiosInstance.post(`parameters`, newParam, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewParam({ name: '', value: '' });
      fetchParameters();
    } catch (error) {
      alert('Erro ao criar parâmetro');
    }
  };

  const handleUpdate = async (id: number, newValue: string) => {
    try {
      await axiosInstance.put(
        `parameters/${id}`,
        { value: newValue },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchParameters();
    } catch (error) {
      alert('Erro ao atualizar parâmetro');
    }
  };

  return (
    <div className='min-h-screen p-6 bg-gray-200'>
      <h2 className='text-2xl font-bold mb-4 text-gray-400'>
        Painel Administrativo - Cosmos 3D
      </h2>
      <div className='mb-6'>
        <h3 className='text-xl font-semibold mb-2 text-gray-400'>
          Criar Novo Parâmetro
        </h3>
        <form onSubmit={handleCreate} className='flex space-x-2'>
          <input
            type='text'
            placeholder='Nome'
            value={newParam.name}
            onChange={(e) => setNewParam({ ...newParam, name: e.target.value })}
            required
            className='border p-2'
          />
          <input
            type='number'
            placeholder='Valor'
            value={newParam.value}
            onChange={(e) =>
              setNewParam({ ...newParam, value: e.target.value })
            }
            required
            className='border p-2'
          />
          <button
            type='submit'
            className='bg-blue-500 text-white py-2 px-4 rounded'
          >
            Criar
          </button>
        </form>
      </div>
      <div>
        <h3 className='text-xl font-semibold mb-2 text-gray-400'>
          Parâmetros Existentes
        </h3>
        <ul>
          {parameters.map((param) => (
            <li
              key={param.id}
              className='mb-2 flex items-center space-x-2 text-gray-400'
            >
              <span>
                {param.name}: {param.value}
              </span>
              <input
                type='number'
                placeholder='Novo valor'
                onChange={(e) => handleUpdate(param.id, e.target.value)}
                className='border p-1'
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Admin;
