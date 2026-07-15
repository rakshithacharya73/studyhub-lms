import { QuizAttempt } from '../types';

export interface BadgeTier {
  name: string;
  minPoints: number;
  icon: string;
  color: string;
}

export const BADGE_TIERS: BadgeTier[] = [
  { name: 'Bronze Scholar', minPoints: 0, icon: '🥉', color: 'text-amber-700 bg-amber-50 border-amber-200' },
  { name: 'Silver Master', minPoints: 51, icon: '🥈', color: 'text-slate-600 bg-slate-50 border-slate-200' },
  { name: 'Gold Legend', minPoints: 151, icon: '🥇', color: 'text-yellow-600 bg-yellow-50 border-yellow-200' }
];

export const calculatePointsForAttempt = (attempt: QuizAttempt): number => {
  const participationPoints = 10;
  const scorePoints = attempt.score * 5;
  return participationPoints + scorePoints;
};

export const calculateTotalPoints = (attempts: QuizAttempt[]): number => {
  return attempts.reduce((total, attempt) => total + calculatePointsForAttempt(attempt), 0);
};

export const getBadgeForPoints = (points: number): BadgeTier => {
  for (let i = BADGE_TIERS.length - 1; i >= 0; i--) {
    if (points >= BADGE_TIERS[i].minPoints) {
      return BADGE_TIERS[i];
    }
  }
  return BADGE_TIERS[0];
};

export interface LeaderboardEntry {
  studentId: string;
  studentName: string;
  points: number;
  badge: BadgeTier;
  quizzesTaken: number;
}

export const generateLeaderboard = (attempts: QuizAttempt[], users: any[]): LeaderboardEntry[] => {
  const studentMap: Record<string, LeaderboardEntry> = {};

  attempts.forEach(attempt => {
    if (!studentMap[attempt.studentId]) {
      studentMap[attempt.studentId] = {
        studentId: attempt.studentId,
        studentName: attempt.studentName,
        points: 0,
        badge: BADGE_TIERS[0],
        quizzesTaken: 0
      };
    }
    
    studentMap[attempt.studentId].points += calculatePointsForAttempt(attempt);
    studentMap[attempt.studentId].quizzesTaken += 1;
  });

  users.forEach(user => {
    if (user.role === 'student' && !studentMap[user.uid]) {
      studentMap[user.uid] = {
        studentId: user.uid,
        studentName: user.name,
        points: 0,
        badge: BADGE_TIERS[0],
        quizzesTaken: 0
      };
    }
  });

  const leaderboard = Object.values(studentMap).map(entry => ({
    ...entry,
    badge: getBadgeForPoints(entry.points)
  }));

  leaderboard.sort((a, b) => b.points - a.points);

  return leaderboard;
};
