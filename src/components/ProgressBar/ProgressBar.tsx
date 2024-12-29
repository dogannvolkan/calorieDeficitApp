import React from 'react';
import styled from 'styled-components';

interface ProgressBarProps {
  progress: number; // 0 to 100
  label?: string;
}

const ProgressContainer = styled.div`
  width: 100%;
  cursor: progress;
`;

const ProgressTrack = styled.div`
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $progress: number }>`
  width: ${props => props.$progress}%;
  height: 100%;
  background: #4a90e2;
  transition: width 0.3s ease;
`;

const Label = styled.div`
  margin-bottom: 8px;
  font-size: 14px;
  color: #666;
`;

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <ProgressContainer>
      {label && <Label>{label}</Label>}
      <ProgressTrack>
        <ProgressFill $progress={Math.min(100, Math.max(0, progress))} />
      </ProgressTrack>
    </ProgressContainer>
  );
}; 