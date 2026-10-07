export const MAP_USER_RESPONSE_NAME_TO_DATA = {
  id: "id",
  email_address: "email",
  first_name: "firstName",
  last_name: "lastName",
  username: "username",
  sex: "sex",
  birthday: "birthday",
  register_date: "registerDate",
  firebase_id_token: "token",
  firebase_refresh_token: "refreshToken",
};

export const MAP_USER_DATA_NAME_TO_PAYLOAD = {
  firstName: "first_name",
  lastName: "last_name",
  username: "username",
  sex: "sex",
  birthday: "birthday",
  registerDate: "register_date",
};

export const MAP_USER_GOAL_RESPONSE_NAME_TO_DATA = {
  user_id: "id",
  height: "height",
  starting_weight: "startingWeight",
  goal_weight: "goalWeight",
  activity_level: "activityLevel",
  goal_calories: "goalCalories",
  goal_protein: "goalProtein",
  goal_carbs: "goalCarbs",
  goal_fat: "goalFat",
  starting_date: "startingDate",
  goal_date: "goalDate",
  weekly_rate: "weeklyRate",
  plan: "plan",
};

export const MAP_USER_GOAL_DATA_NAME_TO_PAYLOAD = {
  height: "height",
  startingWeight: "starting_weight",
  goalWeight: "goal_weight",
  activityLevel: "activity_level",
  goalCalories: "goal_calories",
  goalProtein: "goal_protein",
  goalCarbs: "goal_carbs",
  goalFat: "goal_fat",
  startingDate: "starting_date",
  goalDate: "goal_date",
  weeklyRate: "weekly_rate",
  plan: "plan",
};

export const MAP_WEIGHT_HISTORY_RESPONSE_NAME_TO_DATA = {
  id: "id",
  user_id: "userId",
  date: "date",
  weight: "weight",
};

export const MAP_WEIGHT_HISTORY_DATA_NAME_TO_PAYLOAD = {
  date: "date",
  weight: "weight",
};

export const MAP_FOOD_RESPONSE_NAME_TO_DATA = {
  id: "id",
  user_id: "userId",
  name: "name",
  barcode: "barcode",
  image_uri: "imageUri",
  image_delete_uri: "imageDeleteUri",
  is_verified: "isVerified",
  nutri_score: "nutriScore",
  kcal_per_100_g: "kcalPer100G",
  protein_per_100_g: "proteinPer100G",
  carbs_per_100_g: "carbsPer100G",
  fat_per_100_g: "fatPer100G",
  sugar_per_100_g: "sugarPer100G",
  added_sugar_per_100_g: "addedSugarPer100G",
  recommended_serving_size: "recommendedServingSize",
};

export const MAP_FOOD_DATA_NAME_TO_PAYLOAD = {
  name: "name",
  barcode: "barcode",
  imageUri: "image_uri",
  imageDeleteUri: "image_delete_uri",
  kcalPer100G: "kcal_per_100_g",
  proteinPer100G: "protein_per_100_g",
  carbsPer100G: "carbs_per_100_g",
  fatPer100G: "fat_per_100_g",
  sugarPer100G: "sugar_per_100_g",
  addedSugarPer100G: "added_sugar_per_100_g",
  recommendedServingSize: "recommended_serving_size",
};

export const MAP_MEAL_RESPONSE_NAME_TO_DATA = {
  id: "id",
  user_id: "userId",
  name: "name",
  kcal: "kcal",
  nutri_score: "nutriScore",
  image_uri: "imageUri",
  image_delete_uri: "imageDeleteUri",
  foods: "foods",
};

export const MAP_MEAL_DATA_NAME_TO_PAYLOAD = {
  name: "name",
  kcal: "kcal",
  nutriScore: "nutri_score",
  imageUri: "image_uri",
  imageDeleteUri: "image_delete_uri",
  foods: "foods",
};

export const MAP_MEAL_FOOD_RESPONSE_NAME_TO_DATA = {
  food_id: "foodId",
  quantity: "quantity",
};

export const MAP_MEAL_FOOD_DATA_NAME_TO_PAYLOAD = {
  foodId: "food_id",
  quantity: "quantity",
};

export const MAP_FOOD_HISTORY_RESPONSE_NAME_TO_DATA = {
  id: "id",
  user_id: "userId",
  food_id: "foodId",
  meal_category: "mealCategory",
  quantity: "quantity",
  date: "date",
};

export const MAP_FOOD_HISTORY_DATA_NAME_TO_PAYLOAD = {
  foodId: "food_id",
  mealCategory: "meal_category",
  quantity: "quantity",
  date: "date",
};
