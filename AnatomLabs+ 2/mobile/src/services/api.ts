import axios, { AxiosInstance, AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  User,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  BodyPart,
  Exercise,
  WorkoutPlan,
  GenerateWorkoutRequest,
  NutritionPlan,
  DailyReport,
  WeeklyReport,
  ActivityLog,
  ApiResponse,
  ApiError,
} from '../types';

// IMPORTANT: Update this with your computer's IP address
// Find it using: ipconfig (Windows) or ifconfig (Mac/Linux)

// Configuration: Update your IP here
const YOUR_IP = '192.168.15.36';

// Automatic URL selection based on platform
import { Platform } from 'react-native';

const getApiUrl = () => {
  if (__DEV__) {
    // Development mode
    if (Platform.OS === 'ios') {
      // iOS Simulator can use localhost
      return 'http://localhost:3001/api';
    } else if (Platform.OS === 'android') {
      // Android Emulator special IP
      return 'http://10.0.2.2:3001/api';
    }
    // Physical device
    return `http://${YOUR_IP}:3001/api`;
  }
  // Production mode
  return 'https://your-production-api.com/api';
};

const API_BASE_URL = getApiUrl();

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use(
      async (config) => {
        const token = await AsyncStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Handle response errors
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        if (error.response?.status === 401) {
          // Clear token on unauthorized
          await AsyncStorage.removeItem('auth_token');
          await AsyncStorage.removeItem('user_data');
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response) {
      return {
        success: false,
        error: 'API Error',
        message: (error.response.data as any)?.message || error.message,
        statusCode: error.response.status,
      };
    } else if (error.request) {
      return {
        success: false,
        error: 'Network Error',
        message: 'Unable to reach server. Check your connection.',
        statusCode: 0,
      };
    }
    return {
      success: false,
      error: 'Unknown Error',
      message: error.message,
      statusCode: 0,
    };
  }

  // Authentication
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    );
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    return response.data.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await this.api.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    const { token, user } = response.data.data;
    await AsyncStorage.setItem('auth_token', token);
    await AsyncStorage.setItem('user_data', JSON.stringify(user));
    return response.data.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem('auth_token');
    await AsyncStorage.removeItem('user_data');
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await AsyncStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('auth_token');
    return !!token;
  }

  // Body Parts & Anatomy
  async getBodyParts(layer?: number): Promise<BodyPart[]> {
    const params = layer ? { layer } : {};
    const response = await this.api.get<ApiResponse<BodyPart[]>>('/body-parts', {
      params,
    });
    return response.data.data;
  }

  async getBodyPart(id: string): Promise<BodyPart> {
    const response = await this.api.get<ApiResponse<BodyPart>>(`/body-parts/${id}`);
    return response.data.data;
  }

  async getMuscles(): Promise<any[]> {
    const response = await this.api.get<ApiResponse<any[]>>('/muscles');
    return response.data.data;
  }

  async getMuscle(id: string): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>(`/muscles/${id}`);
    return response.data.data;
  }

  // Exercises
  async getExercises(muscleId?: string): Promise<Exercise[]> {
    const url = muscleId
      ? `/exercises/for-muscle/${muscleId}`
      : '/exercises';
    const response = await this.api.get<ApiResponse<Exercise[]>>(url);
    return response.data.data;
  }

  async getExercise(id: string): Promise<Exercise> {
    const response = await this.api.get<ApiResponse<Exercise>>(`/exercises/${id}`);
    return response.data.data;
  }

  // Workouts
  async generateWorkout(request: GenerateWorkoutRequest): Promise<WorkoutPlan> {
    const response = await this.api.post<ApiResponse<WorkoutPlan>>(
      '/workouts/generate',
      request
    );
    return response.data.data;
  }

  async getWorkoutPlans(): Promise<WorkoutPlan[]> {
    const response = await this.api.get<ApiResponse<WorkoutPlan[]>>('/workouts');
    return response.data.data;
  }

  async getWorkoutPlan(id: string): Promise<WorkoutPlan> {
    const response = await this.api.get<ApiResponse<WorkoutPlan>>(`/workouts/${id}`);
    return response.data.data;
  }

  async logWorkout(workoutId: string, exercises: any[]): Promise<void> {
    await this.api.post('/workouts/log', {
      workoutId,
      exercises,
      date: new Date().toISOString(),
    });
  }

  // Nutrition
  async calculateNutrition(): Promise<NutritionPlan> {
    const response = await this.api.post<ApiResponse<NutritionPlan>>(
      '/nutrition/calculate'
    );
    return response.data.data;
  }

  async getNutritionPlan(): Promise<NutritionPlan> {
    const response = await this.api.get<ApiResponse<NutritionPlan>>('/nutrition');
    return response.data.data;
  }

  async logFood(foodData: {
    foodId: string;
    servings: number;
    mealType: string;
  }): Promise<void> {
    await this.api.post('/nutrition/log', {
      ...foodData,
      date: new Date().toISOString(),
    });
  }

  async searchFood(query: string): Promise<any[]> {
    const response = await this.api.get<ApiResponse<any[]>>('/nutrition/search', {
      params: { q: query },
    });
    return response.data.data;
  }

  // Activity
  async logActivity(activityData: Partial<ActivityLog>): Promise<void> {
    await this.api.post('/activity/log', {
      ...activityData,
      date: new Date().toISOString(),
    });
  }

  async getActivityLog(date?: string): Promise<ActivityLog> {
    const params = date ? { date } : {};
    const response = await this.api.get<ApiResponse<ActivityLog>>('/activity', {
      params,
    });
    return response.data.data;
  }

  // Reports
  async getDailyReport(date?: string): Promise<DailyReport> {
    const params = date ? { date } : {};
    const response = await this.api.get<ApiResponse<DailyReport>>(
      '/reports/daily',
      { params }
    );
    return response.data.data;
  }

  async getWeeklyReport(weekStart?: string): Promise<WeeklyReport> {
    const params = weekStart ? { weekStart } : {};
    const response = await this.api.get<ApiResponse<WeeklyReport>>(
      '/reports/weekly',
      { params }
    );
    return response.data.data;
  }

  async getInjuryRisk(): Promise<any> {
    const response = await this.api.get<ApiResponse<any>>('/injury-prevention');
    return response.data.data;
  }
}

export default new ApiService();
