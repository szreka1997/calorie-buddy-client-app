import COLORS from "../constants/colorConstants";
import {
  SEX,
  GOALS,
  MACROS,
  ACTIVITY_LEVEL,
} from "../constants/commonConstants";
import { getChartConfig } from "./helperFunctions";
import * as BmiUtils from "./bmiUtils";
import * as DateUtils from "./dateUtils";
import * as FormUtils from "./formUtils";
import * as Validation from "../constants/validationConstants";
import * as ValidationUtils from "./validationUtils";

/**
 * Returns configuration for basic user information form fields.
 *
 * @returns {Object} Form field configuration object
 */
export function getBasicInformationFormFieldsConfig() {
  return {
    usernameConfig: FormUtils.createStringFields(
      "username",
      "Username",
      "Enter username",
    ),
    sexConfig: FormUtils.createRadioFields("sex", "Sex", "Select Sex", [
      { label: SEX.MALE, value: SEX.MALE },
      { label: SEX.FEMALE, value: SEX.FEMALE },
    ]),
    birthdayConfig: {
      name: "birthday",
      label: "Birthday",
      placeholderText: "Set birthday",
      rules: {
        required: "Birthday is required!",
        validate: (value) => {
          try {
            ValidationUtils.validateBirthdayParam(value, "birthday");
          } catch (error) {
            return error.message.split("parameter! ")[1];
          }
        },
      },
    },
    heightConfig: FormUtils.createNumericField(
      "height",
      "Height (cm)",
      "Enter height",
      Validation.MIN_HEIGHT,
      Validation.MAX_HEIGHT,
      true,
    ),
  };
}

/**
 * Returns configuration for calorie necessity form fields.
 *
 * @returns {Object} Form field configuration object
 */
export function getCalorieNecessityFormFieldsConfig() {
  return {
    startingWeightConfig: FormUtils.createNumericField(
      "startingWeight",
      "Starting Weight (kg)",
      "Enter starting weight",
      Validation.MIN_WEIGHT,
      Validation.MAX_WEIGHT,
    ),
    activityLevelConfig: FormUtils.createRadioFields(
      "activityLevel",
      "Activity Level",
      "Select activity level",
      [
        {
          label: ACTIVITY_LEVEL.NOT_VERY_ACTIVE.title,
          value: ACTIVITY_LEVEL.NOT_VERY_ACTIVE.title,
          details: ACTIVITY_LEVEL.NOT_VERY_ACTIVE.details,
        },
        {
          label: ACTIVITY_LEVEL.LIGHTLY_ACTIVE.title,
          value: ACTIVITY_LEVEL.LIGHTLY_ACTIVE.title,
          details: ACTIVITY_LEVEL.LIGHTLY_ACTIVE.details,
        },
        {
          label: ACTIVITY_LEVEL.ACTIVE.title,
          value: ACTIVITY_LEVEL.ACTIVE.title,
          details: ACTIVITY_LEVEL.ACTIVE.details,
        },
        {
          label: ACTIVITY_LEVEL.VERY_ACTIVE.title,
          value: ACTIVITY_LEVEL.VERY_ACTIVE.title,
          details: ACTIVITY_LEVEL.VERY_ACTIVE.details,
        },
        {
          label: ACTIVITY_LEVEL.EXTRA_ACTIVE.title,
          value: ACTIVITY_LEVEL.EXTRA_ACTIVE.title,
          details: ACTIVITY_LEVEL.EXTRA_ACTIVE.details,
        },
      ],
    ),
  };
}

/**
 * Returns configuration for goal setting form fields with validation logic.
 *
 * @param {Function} getValues
 * @returns {Array} Form field configuration array
 *
 */
export function getGoalSettingFormFieldsConfig(getValues) {
  function validate(value) {
    let { sex, birthday, height, startingWeight, activityLevel, goalWeight } =
      getValues();

    startingWeight = parseFloat(startingWeight);
    goalWeight = parseFloat(goalWeight);
    const goalCalories = parseInt(value);

    if (!goalCalories) return "Goal calories is required!";

    if (
      !!sex &&
      !!birthday &&
      !!height &&
      !!startingWeight &&
      !!activityLevel &&
      !!goalWeight &&
      !!goalCalories
    ) {
      try {
        const bmr = BmiUtils.getBMR(sex, birthday, height, startingWeight);
        const caloriesNeeds = parseInt(
          BmiUtils.getCalorieNeeds(activityLevel, bmr),
        );
        if (goalWeight > startingWeight) {
          if (goalCalories <= caloriesNeeds) {
            return "You have to consume more calories based on your goal weight!";
          }
          if (goalCalories > caloriesNeeds + 500) {
            return "You have to consume less, because this way you will gain to much fat!";
          }
        }
        if (goalWeight < startingWeight) {
          if (goalCalories >= caloriesNeeds) {
            return "You have to consume less calories based on your goal weight!";
          }
          if (goalCalories < caloriesNeeds - 500) {
            return "You have to consume more for a healthy lifestyle!";
          }
        }
        if (goalWeight === startingWeight && goalCalories !== caloriesNeeds) {
          return "You have to consume exactly the same amount as your calorie need based on your goal!";
        }
      } catch (error) {
        return error.message.split("parameter! ")[1];
      }
    }
  }

  return [
    FormUtils.createNumericField(
      "goalWeight",
      "Goal Weight (kg)",
      "Enter goal weight",
      Validation.MIN_WEIGHT,
      Validation.MAX_WEIGHT,
    ),
    FormUtils.createNumericField(
      "goalCalories",
      "Goal Calories (kcal)",
      "Enter goal calories",
      Validation.MIN_GOAL_CALORIES,
      Validation.MAX_GOAL_CALORIES,
      true,
      validate,
    ),
  ].filter(Boolean);
}

/**
 * Returns configuration for nutrition goals form fields with validation.
 *
 * @param {Function} getValues
 * @returns {Array} Form field configuration array
 */
export function getNutritionGoalsFormFieldsConfig(getValues) {
  function validate() {
    let [goalProtein, goalCarbs, goalFat] = getValues([
      "goalProtein",
      "goalCarbs",
      "goalFat",
    ]);

    goalProtein = parseInt(goalProtein);
    goalCarbs = parseInt(goalCarbs);
    goalFat = parseInt(goalFat);

    if (goalProtein + goalCarbs + goalFat !== 100) {
      return "Macronutrients must equal 100%!";
    }
  }

  return [
    FormUtils.createNumericField(
      "goalProtein",
      "Goal protein (%)",
      "Enter goal protein",
      Validation.MIN_MACRO_PERCENTAGE,
      Validation.MAX_MACRO_PERCENTAGE,
      true,
      validate,
    ),
    FormUtils.createNumericField(
      "goalCarbs",
      "Goal carbs (%)",
      "Enter goal carbs",
      Validation.MIN_MACRO_PERCENTAGE,
      Validation.MAX_MACRO_PERCENTAGE,
      true,
      validate,
    ),
    FormUtils.createNumericField(
      "goalFat",
      "Goal fat (%)",
      "Enter goal fat",
      Validation.MIN_MACRO_PERCENTAGE,
      Validation.MAX_MACRO_PERCENTAGE,
      true,
      validate,
    ),
  ].filter(Boolean);
}

/**
 * Calculates progress ratio towards weight goal.
 *
 * @param {number|string} startingWeight
 * @param {number|string} goalWeight
 * @param {number|string} currentWeight
 * @returns {number|undefined} Value between 0 and 1
 */
export function calculateProgressChartData(
  startingWeight,
  goalWeight,
  currentWeight,
) {
  const parsedStartingWeight = parseFloat(startingWeight);
  const parsedGoalWeight = parseFloat(goalWeight);
  const parsedCurrentWeight = parseFloat(currentWeight);

  if (parsedStartingWeight < parsedGoalWeight) {
    if (parsedCurrentWeight <= parsedStartingWeight) return 0;
    if (parsedCurrentWeight >= parsedGoalWeight) {
      return parsedGoalWeight / parsedCurrentWeight;
    }
    return (
      (parsedCurrentWeight - parsedStartingWeight) /
      (parsedGoalWeight - parsedStartingWeight)
    );
  }
  if (parsedStartingWeight > parsedGoalWeight) {
    if (parsedCurrentWeight >= parsedStartingWeight) return 0;
    if (parsedCurrentWeight <= parsedGoalWeight) {
      return parsedCurrentWeight / parsedGoalWeight;
    }
    return (
      (parsedStartingWeight - parsedCurrentWeight) /
      (parsedStartingWeight - parsedGoalWeight)
    );
  }
}

/**
 * Calculates total weight change (loss or gain) from starting weight.
 *
 * @param {number|string} startingWeight
 * @param {number|string} goalWeight
 * @param {number|string} currentWeight
 * @param {boolean} [isGain=false]
 * @returns {number}
 */
export function calculateTotalLost(
  startingWeight,
  goalWeight,
  currentWeight,
  isGain = false,
) {
  const parsedStartingWeight = parseFloat(startingWeight);
  const parsedGoalWeight = parseFloat(goalWeight);
  const parsedCurrentWeight = parseFloat(currentWeight);
  const isOriginalPlanGain = parsedStartingWeight < parsedGoalWeight;

  if (
    isGain ||
    (isOriginalPlanGain && parsedCurrentWeight === parsedGoalWeight)
  ) {
    return parsedCurrentWeight - parsedStartingWeight;
  }

  return parsedStartingWeight - parsedCurrentWeight;
}

/**
 * Returns label text for total progress (gain/loss) based on goal plan.
 *
 * @param {{ startingWeight: number|string, goalWeight: number|string, plan: Object }} params
 * @returns {string}
 */
export function getProgressTotalGoalLabelName({
  startingWeight,
  goalWeight,
  plan,
}) {
  const parsedStartingWeight = parseFloat(startingWeight);
  const parsedGoalWeight = parseFloat(goalWeight);
  const label =
    plan.plan === GOALS.MAINTAIN
      ? parsedStartingWeight < parsedGoalWeight
        ? "gain"
        : "loose"
      : plan.plan.toLowerCase();

  return `Total ${label}: `;
}

/**
 * Calculates remaining weight to reach the goal.
 *
 * @param {number|string} currentWeight
 * @param {number|string} goalWeight
 * @returns {number}
 */
export function calculateProgressRemaining(currentWeight, goalWeight) {
  return Math.abs(parseFloat(currentWeight) - parseFloat(goalWeight));
}

/**
 * Returns JSX message about optimal weight range if inputs are valid.
 *
 * @param {string} sex
 * @param {Date} birthday
 * @param {number|string} height
 * @param {Object} errors
 * @param {Object} touchedFields
 * @param {boolean} accent
 * @param {React.Component} CustomText
 * @returns {JSX.Element|null}
 */
export function getOptimalWeightMessage(
  sex,
  birthday,
  height,
  errors,
  touchedFields,
  accent,
  CustomText,
) {
  if (errors.sex || errors.birthday || errors.height) return null;
  if (!touchedFields.sex || !touchedFields.birthday || !touchedFields.height) {
    return null;
  }
  if (!sex || !birthday || !height) return null;

  try {
    const weightInfo = BmiUtils.getOptimalWeightRange(height);

    return (
      <CustomText accent={accent}>
        Your optimal bodyweight is{" "}
        <CustomText isHighlight accent={accent}>
          {weightInfo.optimalWeight} kg
        </CustomText>
        . Please note that there is no prescribed ideal body weight today,
        according to experts, overall well-being is more important. Therefore it
        is more correct to say any weight between{" "}
        <CustomText isHighlight accent={accent}>
          {weightInfo.optimalWeightRange.min} and{" "}
          {weightInfo.optimalWeightRange.max} kg
        </CustomText>{" "}
        is suitable for you.
      </CustomText>
    );
  } catch {
    return null;
  }
}

/**
 * Returns JSX message describing daily calorie needs if inputs are valid.
 *
 * @param {string} sex
 * @param {Date} birthday
 * @param {number|string} height
 * @param {number|string} startingWeight
 * @param {string} activityLevel
 * @param {Object} errors
 * @param {boolean} accent
 * @param {React.Component} CustomText
 * @returns {JSX.Element|null}
 */
export function getCalorieNecessityMessage(
  sex,
  birthday,
  height,
  startingWeight,
  activityLevel,
  errors,
  accent,
  CustomText,
) {
  if (
    errors.sex ||
    errors.birthday ||
    errors.height ||
    errors.startingWeight ||
    errors.activityLevel
  ) {
    return null;
  }

  if (!sex || !birthday || !height || !startingWeight || !activityLevel) {
    return null;
  }

  try {
    const bmr = BmiUtils.getBMR(sex, birthday, height, startingWeight);
    const dailyCalories = BmiUtils.getCalorieNeeds(activityLevel, bmr);

    return (
      <CustomText accent={accent}>
        You burn{" "}
        <CustomText isHighlight accent={accent}>
          {bmr} kcal{" "}
        </CustomText>
        per day through the basic functioning of your body. You burn this energy
        even if you just lie down all day (this is your BMR or Basic Metabolic
        Rate). Your basal kcal burn per day is{" "}
        <CustomText isHighlight accent={accent}>
          {dailyCalories} kcal
        </CustomText>
        . This means that this is the total amount of energy you burn through
        your usual daily life.
      </CustomText>
    );
  } catch {
    return null;
  }
}

/**
 * Returns JSX message describing the user's weight goal plan and calorie target.
 *
 * @param {string} sex
 * @param {Date} birthday
 * @param {number|string} height
 * @param {number|string} startingWeight
 * @param {string} activityLevel
 * @param {number|string} goalWeight
 * @param {number|string} goalCalories
 * @param {Object} errors
 * @param {boolean} accent
 * @param {React.Component} CustomText
 * @returns {JSX.Element|null}
 */
export function getGoalPlanMessage(
  sex,
  birthday,
  height,
  startingWeight,
  activityLevel,
  goalWeight,
  goalCalories,
  errors,
  accent,
  CustomText,
) {
  if (
    errors.sex ||
    errors.birthday ||
    errors.height ||
    errors.startingWeight ||
    errors.activityLevel ||
    errors.goalWeight ||
    errors.goalCalories
  ) {
    return null;
  }

  if (
    !sex ||
    !birthday ||
    !height ||
    !startingWeight ||
    !activityLevel ||
    !goalWeight ||
    !goalCalories
  ) {
    return null;
  }

  try {
    const bmr = BmiUtils.getBMR(sex, birthday, height, startingWeight);
    const calorieNeeds = BmiUtils.getCalorieNeeds(activityLevel, bmr);
    const plan = BmiUtils.getLossOrGainPlan(
      startingWeight,
      goalWeight,
      goalCalories,
      calorieNeeds,
    );

    if (plan.plan === GOALS.MAINTAIN) {
      return (
        <CustomText accent={accent}>
          According to your plan you want to{" "}
          <CustomText isHighlight accent={accent}>
            {plan.plan.toLowerCase()}
          </CustomText>{" "}
          your weight. To achieve this, we recommend a daily intake of{" "}
          <CustomText isHighlight accent={accent}>
            {calorieNeeds} calories
          </CustomText>
          . This will be your daily limit, which will appear on the home and the
          food log pages.
        </CustomText>
      );
    }

    return (
      <CustomText accent={accent}>
        According to your{" "}
        <CustomText isHighlight accent={accent}>
          weight {plan.plan.toLowerCase()} plan
        </CustomText>
        , you want to reach a body weight of{" "}
        <CustomText isHighlight accent={accent}>
          {goalWeight} kg
        </CustomText>{" "}
        by{" "}
        <CustomText isHighlight accent={accent}>
          {DateUtils.getDateStringFormat(plan.goalDate)}
        </CustomText>
        , at a rate of{" "}
        <CustomText isHighlight accent={accent}>
          {plan.weeklyRate.toFixed(2)} kg{" "}
        </CustomText>
        per week. To achieve this, we recommend a daily intake of{" "}
        <CustomText isHighlight accent={accent}>
          {goalCalories} calories
        </CustomText>
        .
      </CustomText>
    );
  } catch {
    return null;
  }
}

/**
 * Returns JSX message describing macro nutrient targets and explanations.
 *
 * @param {string} sex
 * @param {Date} birthday
 * @param {number|string} height
 * @param {number|string} startingWeight
 * @param {string} activityLevel
 * @param {number|string} goalWeight
 * @param {number|string} goalCalories
 * @param {number|string} goalProtein
 * @param {number|string} goalCarbs
 * @param {number|string} goalFat
 * @param {Object} errors
 * @param {boolean} accent
 * @param {React.Component} CustomText
 * @returns {JSX.Element|null}
 */
export function getMacrosMessage(
  sex,
  birthday,
  height,
  startingWeight,
  activityLevel,
  goalWeight,
  goalCalories,
  goalProtein,
  goalCarbs,
  goalFat,
  errors,
  accent,
  CustomText,
) {
  if (
    errors.sex ||
    errors.birthday ||
    errors.height ||
    errors.startingWeight ||
    errors.activityLevel ||
    errors.goalWeight ||
    errors.goalCalories ||
    errors.goalProtein ||
    errors.goalCarbs ||
    errors.goalFat
  ) {
    return null;
  }

  if (
    !sex ||
    !birthday ||
    !height ||
    !startingWeight ||
    !activityLevel ||
    !goalWeight ||
    !goalCalories ||
    !goalProtein ||
    !goalCarbs ||
    !goalFat
  ) {
    return null;
  }

  try {
    const protein = BmiUtils.getMacroGramm(
      MACROS.PROTEIN,
      goalProtein,
      goalCalories,
    );
    const carbs = BmiUtils.getMacroGramm(
      MACROS.CARBOHYDRATE,
      goalCarbs,
      goalCalories,
    );
    const fat = BmiUtils.getMacroGramm(MACROS.FAT, goalFat, goalCalories);

    return (
      <CustomText accent={accent}>
        According to your goal, you want to consume —{" "}
        <CustomText isHighlight accent={accent}>
          {protein}g protein, {carbs}g carbs, {fat}g fat
        </CustomText>
        .{"\n"}Your daily calorie burn is made up of three main building blocks
        —{" "}
        <CustomText isHighlight accent={accent}>
          macronutrients
        </CustomText>
        . These are the nutrients your body needs in larger amounts to function
        properly.{"\n"}
        <CustomText isHighlight accent={accent}>
          Proteins{" "}
        </CustomText>
        help build and repair muscles, support immune function, and keep you
        feeling full.{"\n"}
        <CustomText isHighlight accent={accent}>
          Carbohydrates{" "}
        </CustomText>
        are your body’s main source of quick energy. They fuel your brain,
        muscles, and daily activities.{"\n"}
        <CustomText isHighlight accent={accent}>
          Fats{" "}
        </CustomText>
        are essential for hormone production, brain health, and long-lasting
        energy. {"\n"}Each of these macronutrients contributes to your total
        daily calories:{" "}
        <CustomText isHighlight accent={accent}>
          Protein: 4 kcal per gram, Carbs: 4 kcal per gram, Fat: 9 kcal per gram
        </CustomText>
        .
      </CustomText>
    );
  } catch {
    return null;
  }
}

/**
 * Builds nutrition deficit/warning messages based on intake values.
 *
 * @param {number} kcalDeficit
 * @param {number} proteinDeficit
 * @param {number} carbsDeficit
 * @param {number} fatDeficit
 * @param {number} sugarDeficit
 * @param {number} addedSugarDeficit
 * @param {number} [hour=new Date().getHours()]
 * @returns {Array<Object>}
 */
export function buildDeficitMessages(
  kcalDeficit,
  proteinDeficit,
  carbsDeficit,
  fatDeficit,
  sugarDeficit,
  addedSugarDeficit,
  hour = new Date().getHours(),
) {
  const messages = [];

  if (Math.abs(kcalDeficit) > 100) {
    // if (kcalDeficit >= 500) {
    if (kcalDeficit >= 500 && hour >= 20) {
      messages.push({
        message: "You consumed too little calories.",
        risks:
          "Metabolic and hormonal slowdown, Poor mental and emotional health, Reproductive and bone health issues, Weakened immunity.",
      });
      // } else if (kcalDeficit > 0) {
    } else if (kcalDeficit > 0 && hour >= 20) {
      messages.push({ message: "You consumed too little calories." });
    }

    if (kcalDeficit <= -500) {
      messages.push({
        message: "You consumed too much calories.",
        risks:
          "Type 2 diabetes, Metabolic diseases, Hormonal & appetite regulation issues, Inflammation & oxidative stress.",
      });
    } else if (kcalDeficit < 0) {
      messages.push({ message: "You consumed too much calories." });
    }
  }

  // if (proteinDeficit > 0) {
  if (proteinDeficit > 0 && hour >= 20) {
    messages.push({
      message: "You consumed too little protein.",
      risks:
        proteinDeficit >= 50
          ? "Muscle loss and weakness, Slower healing, Poor immune function, Fatigue, Bone health decline."
          : undefined,
    });
  }

  if (carbsDeficit < 0) {
    messages.push({
      message: "You consumed too much carbs.",
      risks:
        carbsDeficit <= -50
          ? "Blood sugar spikes, Fat storage, Risk of insulin resistance, Cardiovascular impact."
          : undefined,
    });
  }

  if (fatDeficit < 0) {
    messages.push({
      message: "You consumed too much fat.",
      risks:
        fatDeficit <= -40
          ? "Cardiovascular problems, Liver stress, Inflammation."
          : undefined,
    });
  }

  if (sugarDeficit < 0) {
    messages.push({
      message: "You consumed too much sugar.",
      risks:
        sugarDeficit <= -30
          ? "Blood sugar & insulin problems, Digestive issues, Dental health, Liver strain."
          : undefined,
    });
  }

  if (addedSugarDeficit < 0) {
    messages.push({
      message: "You consumed too much added sugar.",
      risks:
        addedSugarDeficit <= -20
          ? "Type 2 diabetes, Heart problems, Chronic joint inflammation."
          : undefined,
    });
  }

  if (messages.length === 0) {
    messages.push({
      good: true,
      message: "You're doing great, keep up the good work!",
    });
  }

  return messages;
}

/**
 * Prepares weight progress chart data and configuration.
 *
 * @param {{ startingWeight: number|string, goalWeight: number|string, currentWeight: number|string }} params
 * @returns {{ data: number, chartConfig: Object }}
 */
export function getWeightProggressChartData({
  startingWeight,
  goalWeight,
  currentWeight,
}) {
  const data = calculateProgressChartData(
    startingWeight,
    goalWeight,
    currentWeight,
  );
  const chartConfig = getChartConfig({ color: COLORS.ACCENT_500 });

  return { data, chartConfig };
}
