import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';

interface WaterIntakeProps {
  currentAmount: number;
  goal: number;
  onAmountChange: (amount: number) => void;
  onGoalChange: (goal: number) => void;
}

const Container = styled.div`
  position: relative;
`;

const WaterBar = styled.div`
  width: 100%;
  height: 40px;
  background: #e0e0e0;
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  position: relative;
  touch-action: none;
`;

const Progress = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background: linear-gradient(90deg, #4a90e2, #357abd);
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform-origin: 50% 50%;
    animation: wave 2s linear infinite;
    pointer-events: none;
  }

  @keyframes wave {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const Label = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #fff;
  text-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  z-index: 1;
  font-weight: 500;
  white-space: nowrap;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
`;

const AmountButton = styled(Button)`
  padding: 4px 8px;
  font-size: 14px;
  flex: 1;
  min-width: 80px;

  &:last-child {
    background: #e57373;

    &:hover {
      background: #ef5350;
    }
  }
`;

const GoalButton = styled(Button)`
  margin-top: 12px;
  width: 100%;
`;

const GoalInput = styled.div`
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Input = styled.input`
  padding: 4px 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 80px;
`;

export const WaterIntake: React.FC<WaterIntakeProps> = ({
  currentAmount,
  goal,
  onAmountChange,
  onGoalChange,
}) => {
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState(goal.toString());
  const [isDragging, setIsDragging] = useState(false);
  const [lastX, setLastX] = useState<number | null>(null);
  const [isDragClick, setIsDragClick] = useState(false);
  const [dragStartX, setDragStartX] = useState<number | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setLastX(e.clientX);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(false);
    if (dragStartX && Math.abs(e.clientX - dragStartX) < 5) {
      updateWaterAmount(e);
    }
    setLastX(null);
    setDragStartX(null);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setLastX(null);
    setDragStartX(null);
  };

  const calculateAmountChange = (currentX: number, previousX: number | null) => {
    if (previousX === null) return 0;
    const diff = currentX - previousX;
    return (diff / 20000) * goal;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const amountChange = calculateAmountChange(currentX, lastX);
    if (amountChange !== 0) {
      const newAmount = Math.max(0, Math.min(goal, currentAmount + amountChange));
      onAmountChange(Math.round(newAmount * 10) / 10);
    }
    setLastX(currentX);
  };

  const updateWaterAmount = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = (clickPosition / rect.width) * 100;
    const newAmount = Math.round((percentage / 100) * goal * 10) / 10;
    onAmountChange(Math.min(Math.max(0, newAmount), goal));
    setLastX(e.clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const touch = e.touches[0];
    const currentX = touch.clientX;
    const amountChange = calculateAmountChange(currentX, lastX);
    if (amountChange !== 0) {
      const newAmount = Math.max(0, Math.min(goal, currentAmount + amountChange));
      onAmountChange(Math.round(newAmount * 20) / 20);
    }
    setLastX(currentX);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setLastX(touch.clientX);
    setDragStartX(touch.clientX);
  };

  const handleGoalSubmit = () => {
    const parsedGoal = parseFloat(newGoal);
    if (!isNaN(parsedGoal) && parsedGoal > 0) {
      onGoalChange(parsedGoal);
      setIsEditingGoal(false);
    }
  };

  const addAmount = (amount: number) => {
    onAmountChange(Math.min(currentAmount + amount, goal));
  };

  return (
    <Container>
      <WaterBar 
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchStart={handleTouchStart}
      >
        <Progress width={(currentAmount / goal) * 100} />
        <Label>
          {`${currentAmount.toFixed(1)}L / ${goal.toFixed(1)}L `}
          {currentAmount >= goal && '🎉'}
        </Label>
      </WaterBar>
      
      <Controls>
        <AmountButton onClick={() => addAmount(0.1)}>+100ml</AmountButton>
        <AmountButton onClick={() => addAmount(0.25)}>+250ml</AmountButton>
        <AmountButton onClick={() => addAmount(0.5)}>+500ml</AmountButton>
        <AmountButton onClick={() => onAmountChange(0)}>Reset</AmountButton>
      </Controls>

      {isEditingGoal ? (
        <GoalInput>
          <Input
            type="number"
            value={newGoal}
            onChange={(e) => setNewGoal(e.target.value)}
            step="0.1"
            min="0.5"
            placeholder="Daily goal (L)"
            autoFocus
          />
          <Button onClick={handleGoalSubmit}>Save</Button>
          <Button onClick={() => setIsEditingGoal(false)}>Cancel</Button>
        </GoalInput>
      ) : (
        <GoalButton onClick={() => setIsEditingGoal(true)}>Change Goal</GoalButton>
      )}
    </Container>
  );
}; 