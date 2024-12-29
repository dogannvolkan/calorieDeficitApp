import React from 'react';
import styled from 'styled-components';
import { Card } from '../Card/Card';
import { Button } from '../Button/Button';

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  protein: number;
  carbs: number;
  fat: number;
}

interface MealLogProps {
  meals: Meal[];
  onAddMeal: () => void;
  onEditMeal: (meal: Meal) => void;
}

const MealContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const MealItem = styled(Card)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
`;

const AddMealButton = styled(Button)`
  margin-top: 16px;
`;

const MealInfo = styled.div`
  flex: 1;
`;

const MacroInfo = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 4px;
  font-size: 12px;
  color: #666;
`;

const MacroItem = styled.span`
  background: #eee;
  padding: 2px 6px;
  border-radius: 4px;
`;

const TimeText = styled.span`
  color: #666;
  font-size: 14px;
`;

export const MealLog: React.FC<MealLogProps> = ({ meals, onAddMeal, onEditMeal }) => {
  return (
    <MealContainer>
      {meals.length === 0 ? (
        <p>No meals logged yet. Add your first meal!</p>
      ) : (
        meals.map(meal => (
          <MealItem key={meal.id} interactive onClick={() => onEditMeal(meal)}>
            <MealInfo>
              <h3>{meal.name}</h3>
              <p>{meal.calories} calories</p>
              <MacroInfo>
                <MacroItem>P: {meal.protein}g</MacroItem>
                <MacroItem>C: {meal.carbs}g</MacroItem>
                <MacroItem>F: {meal.fat}g</MacroItem>
              </MacroInfo>
            </MealInfo>
            {meal.time && <TimeText>{meal.time}</TimeText>}
          </MealItem>
        ))
      )}
      <AddMealButton onClick={onAddMeal}>Add Meal</AddMealButton>
    </MealContainer>
  );
}; 