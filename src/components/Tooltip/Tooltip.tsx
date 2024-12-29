import React from 'react';
import styled from 'styled-components';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const TooltipContainer = styled.div`
  position: relative;
  display: inline-block;
  cursor: help;
`;

const TooltipContent = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  padding: 8px;
  background: #333;
  color: white;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s ease;

  ${TooltipContainer}:hover & {
    opacity: 1;
    visibility: visible;
  }
`;

export const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <TooltipContainer>
      {children}
      <TooltipContent>{content}</TooltipContent>
    </TooltipContainer>
  );
};
