import { useMemo } from 'react';
import { User, UserProgress, LeaderboardEntry, SessionRecord } from '../types';
import { MOCK_LEADERBOARD_DATA } from '../constants';

const getWeeklyMinutes = (sessions: SessionRecord[]): number => {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    return sessions
        .filter(s => new Date(s.date) >= sevenDaysAgo)
        .reduce((sum, s) => sum + s.durationMinutes, 0);
};

// Helper to safely get data from localStorage
const getStoredUsers = (): User[] => {
    try {
        const usersJSON = localStorage.getItem('focusup-users');
        return usersJSON ? JSON.parse(usersJSON) : [];
    } catch {
        return [];
    }
};

const getStoredProgress = (userId: string): UserProgress | null => {
    try {
        const progressJSON = localStorage.getItem(`userProgress_${userId}`);
        return progressJSON ? JSON.parse(progressJSON) : null;
    } catch {
        return null;
    }
};

export const useLeaderboard = (currentUser: User | null, userProgress: UserProgress) => {

  const sortedLeaderboard = useMemo(() => {
    // 1. Get all "real" users from localStorage
    const allUsers = getStoredUsers();
    const realUserEntries: LeaderboardEntry[] = allUsers.map(user => {
        const progress = getStoredProgress(user.id);
        const weeklyMinutes = progress ? getWeeklyMinutes(progress.sessions) : 0;
        
        const isCurrentUser = currentUser?.id === user.id;

        return {
            id: user.id,
            name: isCurrentUser ? `${user.name} (Anda)` : user.name,
            totalMinutes: weeklyMinutes,
            isCurrentUser: isCurrentUser,
        };
    });

    // 2. Combine with mock data for a fuller experience, avoiding duplicates
    const realUserIds = new Set(allUsers.map(u => u.id));
    // FIX: Map mock users to LeaderboardEntry format, converting ID to string and adding isCurrentUser.
    const mockEntries: LeaderboardEntry[] = MOCK_LEADERBOARD_DATA
      .filter(mockUser => !realUserIds.has(String(mockUser.id)))
      .map(mockUser => ({
        id: String(mockUser.id),
        name: mockUser.name,
        totalMinutes: mockUser.totalMinutes,
        isCurrentUser: false,
      }));

    // 3. Combine and sort
    const combinedData = [...realUserEntries, ...mockEntries];
    
    return combinedData.sort((a, b) => b.totalMinutes - a.totalMinutes);

  }, [currentUser]); // Re-calculates when the current user changes.

  const currentUserRank = useMemo(() => {
    if (!currentUser) return null;
    const rank = sortedLeaderboard.findIndex(u => u.id === currentUser.id);
    return rank !== -1 ? rank + 1 : null;
  }, [sortedLeaderboard, currentUser]);

  return { sortedLeaderboard, currentUserRank };
};
