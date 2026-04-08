import React, { useState } from 'react';
import { repairBrokenUsers } from '../utils/repairUsers';

const UserRepairTool = () => {
  const [repairResult, setRepairResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleRepair = async () => {
    setIsLoading(true);
    try {
      const result = await repairBrokenUsers();
      setRepairResult(result);
    } catch (error) {
      console.error('Error al reparar usuarios:', error);
      setRepairResult({
        error: true,
        message: 'Ocurrió un error al intentar reparar los usuarios',
        details: error.message
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      padding: '20px',
      margin: '20px',
      border: '1px solid #ccc',
      borderRadius: '8px',
      maxWidth: '600px',
      backgroundColor: '#f9f9f9'
    }}>
      <h2>Herramienta de Reparación de Usuarios</h2>
      <p>
        Esta herramienta repara usuarios que puedan tener una estructura incorrecta en el almacenamiento local.
      </p>
      
      <button 
        onClick={handleRepair}
        disabled={isLoading}
        style={{
          padding: '10px 15px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '10px 0'
        }}
      >
        {isLoading ? 'Reparando...' : 'Reparar Usuarios'}
      </button>

      {repairResult && (
        <div style={{
          marginTop: '20px',
          padding: '15px',
          backgroundColor: repairResult.error ? '#ffebee' : '#e8f5e9',
          borderLeft: `4px solid ${repairResult.error ? '#f44336' : '#4CAF50'}`,
          borderRadius: '4px'
        }}>
          {repairResult.error ? (
            <>
              <h3>Error</h3>
              <p>{repairResult.message}</p>
              <pre style={{ whiteSpace: 'pre-wrap' }}>{repairResult.details}</pre>
            </>
          ) : repairResult.repaired ? (
            <>
              <h3>Reparación Exitosa</h3>
              <p>Se repararon {repairResult.count} usuarios:</p>
              <ul>
                {repairResult.users.map((user, index) => (
                  <li key={index}>{user}</li>
                ))}
              </ul>
            </>
          ) : (
            <p>No se encontraron usuarios que requieran reparación.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default UserRepairTool;
