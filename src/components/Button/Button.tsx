import React from 'react';
import styled from 'styled-components';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  children: React.ReactNode;
}

const StyledButton = styled.button<{ $loading?: boolean }>`
  padding: 12px 24px;
  border-radius: 8px;
  border: none;
  background: #4a90e2;
  color: white;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: ${props => props.$loading ? 'wait' : 'pointer'};

  &:hover {
    background: #357abd;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

export const Button: React.FC<ButtonProps> = ({ 
  loading, 
  children, 
  onClick, 
  ...props 
}) => {
  return (
    <StyledButton 
      $loading={loading} 
      onClick={onClick} 
      disabled={loading} 
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  );
}; 