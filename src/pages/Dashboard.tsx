import React, { useState } from 'react';
import styled from 'styled-components';
import { Card } from '../components/Card/Card';
import { Button } from '../components/Button/Button';
import { ProgressBar } from '../components/ProgressBar/ProgressBar';
import { MealLog } from '../components/MealLog/MealLog';
import { Modal } from '../components/Modal/Modal';
import { MealForm } from '../components/MealForm/MealForm';
import { UserProfileForm } from '../components/UserProfileForm/UserProfileForm';
import { WaterIntake } from '../components/WaterIntake/WaterIntake';

const DashboardContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatsCard = styled(Card)`
  cursor: pointer;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
`;

const ProfileButton = styled(Button)`
  background: #357abd;
`;

const ProfileCard = styled(Card)`
  margin-bottom: 24px;
`;

const ProfileInfo = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-top: 16px;
`;

const InfoItem = styled.div`
  background: #f5f5f5;
  padding: 12px;
  border-radius: 8px;
  
  h4 {
    color: #666;
    margin-bottom: 4px;
  }
  
  p {
    color: #333;
    font-weight: 500;
  }
`;

const MacroInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
`;

const MacroItem = styled.div`
  background: #f5f5f5;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  color: #666;
`;

const determineWeightGoal = (currentWeight: number, targetWeight: number) => {
  if (Math.abs(currentWeight - targetWeight) < 0.1) return 'maintain';
  return currentWeight < targetWeight ? 'gain' : 'lose';
};

const calculateRequiredCalorieAdjustment = (
  currentWeight: number,
  targetWeight: number,
  targetDate: string
) => {
  const weightDiff = Math.abs(currentWeight - targetWeight);
  const daysUntilTarget = Math.max(1, Math.round((new Date(targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)));
  // 7700 calories = 1kg
  const totalCaloriesNeeded = weightDiff * 7700;
  const dailyAdjustment = Math.round(totalCaloriesNeeded / daysUntilTarget);
  return currentWeight < targetWeight ? dailyAdjustment : -dailyAdjustment;
};

const calculateDailyCalories = (profile: {
  age: number;
  height: number;
  weight: number;
  gender: 'male' | 'female';
  activityLevel: string;
  targetWeight: number;
  targetDate: string;
}) => {
  // Mifflin-St Jeor Equation
  let bmr;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }

  // Activity multiplier
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    extra: 1.9,
  };

  const tdee = Math.round(bmr * multipliers[profile.activityLevel as keyof typeof multipliers]);
  
  const calorieAdjustment = calculateRequiredCalorieAdjustment(
    profile.weight,
    profile.targetWeight,
    profile.targetDate
  );

  return tdee + calorieAdjustment;
};

interface Meal {
  id: string;
  name: string;
  calories: number;
  time: string;
  protein: number;
  carbs: number;
  fat: number;
}

const calculateMacroTotals = (meals: Meal[]) => {
  return meals.reduce((totals, meal) => ({
    protein: totals.protein + (meal.protein || 0),
    carbs: totals.carbs + (meal.carbs || 0),
    fat: totals.fat + (meal.fat || 0),
  }), { protein: 0, carbs: 0, fat: 0 });
};

const calculateMacroGoals = (weight: number, currentWeight: number, targetWeight: number, calories: number) => {
  const goal = determineWeightGoal(currentWeight, targetWeight);
  
  // Protein: 2g per kg for weight loss, 1.6g for maintenance, 2.2g for muscle gain
  const proteinMultiplier = {
    lose: 2,
    maintain: 1.6,
    gain: 2.2
  };
  
  const protein = Math.round(weight * proteinMultiplier[goal]);
  
  // Fat: 20-35% of total calories (using 25%)
  const fat = Math.round((calories * 0.25) / 9);
  
  // Remaining calories from carbs
  const carbCalories = calories - (protein * 4) - (fat * 9);
  const carbs = Math.round(carbCalories / 4);
  
  return { protein, carbs, fat };
};

export const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingMeal, setEditingMeal] = useState<null | Meal>(null);
  const [meals, setMeals] = useState<Meal[]>([]);
  const [userProfile, setUserProfile] = useState<null | {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    activityLevel: string;
    targetWeight: number;
    targetDate: string;
  }>(null);
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);
  const totalCaloriesToday = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const calorieProgress = Math.round((totalCaloriesToday / dailyCalorieGoal) * 100);
  const [waterAmount, setWaterAmount] = useState(1.2);
  const [waterGoal, setWaterGoal] = useState(2.0);

  const handleProfileSubmit = (profile: {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    activityLevel: string;
    targetWeight: number;
    targetDate: string;
  }) => {
    setUserProfile(profile);
    const tdee = calculateDailyCalories(profile);
    setDailyCalorieGoal(tdee);
    setIsProfileModalOpen(false);
  };

  const handleEditMeal = (meal: Meal) => {
    setEditingMeal(meal);
    setIsModalOpen(true);
  };

  const handleMealSubmit = (mealData: {
    name: string;
    calories: number;
    time: string;
    protein: number;
    carbs: number;
    fat: number;
  }) => {
    if (editingMeal) {
      setMeals(meals.map(meal => 
        meal.id === editingMeal.id 
          ? { ...meal, ...mealData }
          : meal
      ));
    } else {
      setMeals([...meals, { id: String(Date.now()), ...mealData }]);
    }
    setIsModalOpen(false);
    setEditingMeal(null);
  };

  const formatActivityLevel = (level: string) => {
    const formats: { [key: string]: string } = {
      sedentary: 'Sedentary (office job)',
      light: 'Light Exercise (1-2 days/week)',
      moderate: 'Moderate Exercise (3-5 days/week)',
      active: 'Very Active (6-7 days/week)',
      extra: 'Extra Active (physical job + training)'
    };
    return formats[level] || level;
  };

  const formatGender = (gender: string) => {
    return gender.charAt(0).toUpperCase() + gender.slice(1);
  };

  const getBMICategory = (bmi: number) => {
    if (bmi < 18.5) return 'Underweight';
    if (bmi < 25) return 'Normal weight';
    if (bmi < 30) return 'Overweight';
    return 'Obese';
  };

  return (
    <DashboardContainer>
      <Header>
        <h1>Calorie Deficit App</h1>
        {userProfile ? (
          <ProfileButton onClick={() => setIsProfileModalOpen(true)}>
            Edit Profile
          </ProfileButton>
        ) : (
          <ProfileButton onClick={() => setIsProfileModalOpen(true)}>
            Create Profile
          </ProfileButton>
        )}
      </Header>

      {userProfile && (
        <ProfileCard>
          <h2>Profile Information</h2>
          <ProfileInfo>
            <InfoItem>
              <h4>Basic Info</h4>
              <p>Age: {userProfile.age} years</p>
              <p>Height: {userProfile.height} cm</p>
              <p>Weight: {userProfile.weight} kg</p>
              <p>Gender: {formatGender(userProfile.gender)}</p>
            </InfoItem>
            <InfoItem>
              <h4>Health Metrics</h4>
              <p>BMI: {(() => {
                const bmi = userProfile.weight / Math.pow(userProfile.height / 100, 2);
                return `${bmi.toFixed(1)} (${getBMICategory(bmi)})`;
              })()}</p>
              <p>Activity Level: {formatActivityLevel(userProfile.activityLevel)}</p>
              <p>Daily Calorie Goal: {dailyCalorieGoal} kcal</p>
              {(() => {
                const macroGoals = calculateMacroGoals(
                  userProfile.weight,
                  userProfile.weight,
                  userProfile.targetWeight,
                  dailyCalorieGoal
                );
                return (
                  <>
                    <p>Protein Goal: {macroGoals.protein}g</p>
                    <p>Carbs Goal: {macroGoals.carbs}g</p>
                    <p>Fat Goal: {macroGoals.fat}g</p>
                  </>
                );
              })()}
            </InfoItem>
            <InfoItem>
              <h4>Weight Goals</h4>
              <p>Current Weight: {userProfile.weight} kg</p>
              <p>Target Weight: {userProfile.targetWeight} kg</p>
              {userProfile.weight !== userProfile.targetWeight && (
                <>
                  <p>{`${Math.abs(userProfile.weight - userProfile.targetWeight).toFixed(1)} kg to ${
                    userProfile.weight < userProfile.targetWeight ? 'gain' : 'lose'
                  }`}</p>
                  <p>Target Date: {new Date(userProfile.targetDate).toLocaleDateString()}</p>
                  <p>Days Remaining: {Math.round((new Date(userProfile.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))}</p>
                </>
              )}
            </InfoItem>
          </ProfileInfo>
        </ProfileCard>
      )}

      {!userProfile && (
        <Card>
          <h2>Welcome to Calorie Deficit App!</h2>
          <p>Please create your profile to get started with personalized calorie goals.</p>
        </Card>
      )}

      <Grid>
        <StatsCard interactive>
          <h3>Daily Calories</h3>
          {userProfile ? (
            <>
              <ProgressBar 
                progress={calorieProgress} 
                label={`${totalCaloriesToday} / ${dailyCalorieGoal} kcal`} 
              />
              <MacroInfo>
                {(() => {
                  const macros = calculateMacroTotals(meals);
                  const macroGoals = calculateMacroGoals(
                    userProfile.weight,
                    userProfile.weight,
                    userProfile.targetWeight,
                    dailyCalorieGoal
                  );
                  return (
                    <>
                      <MacroItem>Protein: {macros.protein}g / {macroGoals.protein}g</MacroItem>
                      <MacroItem>Carbs: {macros.carbs}g / {macroGoals.carbs}g</MacroItem>
                      <MacroItem>Fat: {macros.fat}g / {macroGoals.fat}g</MacroItem>
                    </>
                  );
                })()}
              </MacroInfo>
            </>
          ) : (
            <p>Please set up your profile to see calorie goals</p>
          )}
        </StatsCard>
        <StatsCard interactive>
          <h3>Water Intake</h3>
          <WaterIntake
            currentAmount={waterAmount}
            goal={waterGoal}
            onAmountChange={setWaterAmount}
            onGoalChange={setWaterGoal}
          />
        </StatsCard>
      </Grid>

      <Card>
        <h2>Today's Meals</h2>
        <MealLog 
          meals={meals} 
          onAddMeal={() => {
            setEditingMeal(null);
            setIsModalOpen(true);
          }}
          onEditMeal={handleEditMeal}
        />
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMeal(null);
        }}
        title={editingMeal ? 'Edit Meal' : 'Add Meal'}
      >
        <MealForm
          onSubmit={handleMealSubmit}
          initialValues={editingMeal || undefined}
          onCancel={() => {
            setIsModalOpen(false);
            setEditingMeal(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={userProfile ? 'Edit Profile' : 'Create Profile'}
      >
        <UserProfileForm
          onSubmit={handleProfileSubmit}
          onCancel={() => setIsProfileModalOpen(false)}
          initialValues={userProfile || undefined}
        />
      </Modal>
    </DashboardContainer>
  );
}; 