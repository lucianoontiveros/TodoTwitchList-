import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

const UserCard = ({ user, index, total, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  
  // Determinar el color del borde según el rol
  const getRoleColor = (role) => {
    switch(role) {
      case 'broadcaster': return '#e91e63';
      case 'moderator': return '#00b5ad';
      case 'vip': return '#ffd700';
      case 'subscriber': return '#9147ff';
      case 'prime': return '#00a8c5';
      default: return '#808080';
    }
  };

  // Determinar el ícono según el rol
  const getRoleIcon = (role) => {
    switch(role) {
      case 'broadcaster': return '📡';
      case 'moderator': return '🛡️';
      case 'vip': return '⭐';
      case 'subscriber': return '🔔';
      case 'prime': return '👑';
      default: return '👤';
    }
  };

  // Formatear el nombre del rol para mostrarlo
  const formatRole = (role) => {
    const roles = {
      'broadcaster': 'Creador/a',
      'moderator': 'Moderador/a',
      'vip': 'VIP',
      'subscriber': 'Suscriptor/a',
      'prime': 'Prime'
    };
    return roles[role] || 'Usuario';
  };

  // Manejar el cierre con animación
  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300); // Tiempo que dura la animación de salida
  };

  // Configurar el temporizador de cierre automático
  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 10000); // 10 segundos

    return () => clearTimeout(timer);
  }, [onClose]);

  // Si no hay usuario, no renderizar nada
  if (!user) return null;

  return (
    <div 
      className={`user-card ${isExiting ? 'exiting' : 'entering'}`}
      style={{
        borderLeft: `4px solid ${getRoleColor(user.role)}`,
        transform: `translateY(${index * 10}px) scale(${1 - (index * 0.05)})`,
        zIndex: 1000 + index,
      }}
    >
      <div className="card-header">
        <div className="card-avatar" style={{ backgroundColor: user.color }}>
          {user.displayName ? user.displayName.charAt(0).toUpperCase() : '?'}
        </div>
        <div className="card-username">
          {user.displayName || user.username}
        </div>
        <div 
          className="card-role" 
          style={{ 
            backgroundColor: `${getRoleColor(user.role)}20`,
            color: getRoleColor(user.role)
          }}
        >
          {getRoleIcon(user.role)} {formatRole(user.role)}
        </div>
        <button 
          onClick={handleClose}
          className="close-button"
          style={{
            marginLeft: 'auto',
            background: 'none',
            border: 'none',
            color: 'rgba(255, 255, 255, 0.5)',
            cursor: 'pointer',
            fontSize: '16px',
            padding: '4px 8px',
            borderRadius: '4px',
          }}
          onMouseOver={(e) => e.target.style.color = '#fff'}
          onMouseOut={(e) => e.target.style.color = 'rgba(255, 255, 255, 0.5)'}
        >
          ✕
        </button>
      </div>
      
      <div className="card-content">
        <p className="card-message">
          {user.message || 'El usuario ha interactuado con el chat.'}
        </p>
      </div>
      
      <div className="card-footer">
        <span>Ahora mismo</span>
        <span>{index + 1}/{total}</span>
      </div>
      
      <div className="progress-bar">
        <div className="progress-bar-fill" />
      </div>
    </div>
  );
};

UserCard.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    displayName: PropTypes.string,
    role: PropTypes.oneOf(['broadcaster', 'moderator', 'vip', 'subscriber', 'prime', 'default']),
    message: PropTypes.string,
    color: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default UserCard;
