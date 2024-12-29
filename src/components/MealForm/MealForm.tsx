import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';

interface MealFormProps {
  onSubmit: (meal: {
    name: string;
    calories: number;
    time: string;
    protein: number;
    carbs: number;
    fat: number;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    name: string;
    calories: number;
    time: string;
    protein: number;
    carbs: number;
    fat: number;
  };
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const Label = styled.label`
  font-weight: 500;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  cursor: text;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 8px;
`;

const CancelButton = styled(Button)`
  background: #f5f5f5;
  color: #333;

  &:hover {
    background: #e5e5e5;
  }
`;

export const MealForm: React.FC<MealFormProps> = ({ onSubmit, onCancel, initialValues }) => {
  const [name, setName] = useState(initialValues?.name || '');
  const [calories, setCalories] = useState(initialValues?.calories?.toString() || '');
  const [time, setTime] = useState(initialValues?.time || '');
  const [protein, setProtein] = useState(initialValues?.protein?.toString() || '');
  const [carbs, setCarbs] = useState(initialValues?.carbs?.toString() || '');
  const [fat, setFat] = useState(initialValues?.fat?.toString() || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      name,
      calories: parseInt(calories),
      time: time || '',
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="meal-name">Meal Name</Label>
        <Input
          id="meal-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="calories">Calories</Label>
        <Input
          id="calories"
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          required
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="time">Time (Optional)</Label>
        <Input
          id="time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="protein">Protein (g)</Label>
        <Input
          id="protein"
          type="number"
          value={protein}
          onChange={(e) => setProtein(e.target.value)}
          min="0"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="carbs">Carbs (g)</Label>
        <Input
          id="carbs"
          type="number"
          value={carbs}
          onChange={(e) => setCarbs(e.target.value)}
          min="0"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="fat">Fat (g)</Label>
        <Input
          id="fat"
          type="number"
          value={fat}
          onChange={(e) => setFat(e.target.value)}
          min="0"
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="submit">Add Meal</Button>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
      </ButtonGroup>
    </Form>
  );
}; 