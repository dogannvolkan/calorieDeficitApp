import styled from 'styled-components';

interface CardProps {
  interactive?: boolean;
}

export const Card = styled.div<CardProps>`
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  cursor: ${(props) => (props.interactive ? 'pointer' : 'default')};

  &:hover {
    transform: ${(props) => (props.interactive ? 'translateY(-2px)' : 'none')};
    box-shadow: ${(props) =>
      props.interactive ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 2px 8px rgba(0, 0, 0, 0.1)'};
  }
`;
