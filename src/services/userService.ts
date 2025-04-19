import { User, UserRole } from '@/types';
import { ENV } from '@/lib/env';

interface NewUserData {
  name: string;
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

interface UpdateUserData {
  name?: string;
  username?: string;
  email?: string;
  role?: UserRole;
}

class UserService {
  private baseUrl = `${ENV.API_URL}/users`;

  private generateAvatar(name: string, role: UserRole): string {
    const backgroundColors = {
      admin: '3b82f6', // blue
      developer: '10b981', // green
      tester: 'f59e0b', // yellow
    };
    
    const bgColor = backgroundColors[role] || '6b7280'; // gray default
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=${bgColor}&color=fff`;
  }

  private async fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    };

    const response = await fetch(url, { ...options, headers });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'An error occurred' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async getUsers(): Promise<User[]> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/get.php`);
    if (!response.success) {
      throw new Error(response.message);
    }
    return response.data.map((user: any) => ({
      ...user,
      avatar: this.generateAvatar(user.username, user.role)
    }));
  }

  async addUser(userData: NewUserData): Promise<User> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/create.php`, {
      method: 'POST',
      body: JSON.stringify(userData)
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    const newUser = response.data;
    return {
      ...newUser,
      avatar: this.generateAvatar(newUser.username, newUser.role)
    };
  }

  async updateUser(userId: string, userData: UpdateUserData): Promise<User> {
    const response = await this.fetchWithAuth(`${this.baseUrl}/update.php`, {
      method: 'PUT',
      body: JSON.stringify({ id: userId, ...userData })
    });

    if (!response.success) {
      throw new Error(response.message);
    }

    const updatedUser = response.data;
    return {
      ...updatedUser,
      avatar: this.generateAvatar(updatedUser.username, updatedUser.role)
    };
  }

  async deleteUser(userId: string): Promise<boolean> {
    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseUrl}/delete.php?id=${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to delete user');
    }

    return true;
  }
}

export const userService = new UserService();
