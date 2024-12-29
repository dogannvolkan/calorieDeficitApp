import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../Button/Button';

interface UserProfileFormProps {
  onSubmit: (profile: {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    activityLevel: string;
    targetWeight: number;
    targetDate: string;
  }) => void;
  onCancel: () => void;
  initialValues?: {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    activityLevel: string;
    targetWeight: number;
    targetDate: string;
  };
}

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 400px;
  width: 100%;
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

const Select = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

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

export const UserProfileForm: React.FC<UserProfileFormProps> = ({
  onSubmit,
  onCancel,
  initialValues,
}) => {
  const [age, setAge] = useState(initialValues?.age?.toString() || '');
  const [height, setHeight] = useState(initialValues?.height?.toString() || '');
  const [weight, setWeight] = useState(initialValues?.weight?.toString() || '');
  const [gender, setGender] = useState<'male' | 'female'>(initialValues?.gender || 'male');
  const [activityLevel, setActivityLevel] = useState(initialValues?.activityLevel || 'sedentary');
  const [targetWeight, setTargetWeight] = useState(initialValues?.targetWeight?.toString() || '');
  const [targetDate, setTargetDate] = useState(initialValues?.targetDate || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      age: parseInt(age),
      height: parseInt(height),
      weight: parseInt(weight),
      gender,
      activityLevel,
      targetWeight: parseInt(targetWeight),
      targetDate,
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          required
          min="15"
          max="100"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="height">Height (cm)</Label>
        <Input
          id="height"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          min="100"
          max="250"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="weight">Weight (kg)</Label>
        <Input
          id="weight"
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          required
          min="30"
          max="300"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="gender">Gender</Label>
        <Select
          id="gender"
          value={gender}
          onChange={(e) => setGender(e.target.value as 'male' | 'female')}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="activity">Activity Level</Label>
        <Select
          id="activity"
          value={activityLevel}
          onChange={(e) => setActivityLevel(e.target.value)}
          required
        >
          <option value="sedentary">Sedentary (office job)</option>
          <option value="light">Light Exercise (1-2 days/week)</option>
          <option value="moderate">Moderate Exercise (3-5 days/week)</option>
          <option value="active">Very Active (6-7 days/week)</option>
          <option value="extra">Extra Active (physical job + training)</option>
        </Select>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="targetWeight">Target Weight (kg)</Label>
        <Input
          id="targetWeight"
          type="number"
          value={targetWeight}
          onChange={(e) => setTargetWeight(e.target.value)}
          required
          min="30"
          max="300"
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="targetDate">Target Date</Label>
        <Input
          id="targetDate"
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          required
          min={new Date().toISOString().split('T')[0]}
        />
      </FormGroup>

      <ButtonGroup>
        <Button type="submit">Save Profile</Button>
        <CancelButton type="button" onClick={onCancel}>
          Cancel
        </CancelButton>
      </ButtonGroup>
    </Form>
  );
};
