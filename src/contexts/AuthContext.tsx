
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // 우리가 방금 만든 설정 파일을 import 합니다.

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged는 Firebase 인증 상태의 변경을 실시간으로 감지하는 리스너입니다.
    // 사용자가 로그인하거나 로그아웃할 때마다 이 함수가 실행됩니다.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    // 컴포넌트가 언마운트될 때 리스너를 정리합니다.
    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    loading,
  };

  // 로딩 중일 때는 아무것도 렌더링하지 않거나 로딩 스피너를 보여줄 수 있습니다.
  // 여기서는 로딩이 끝나야 자식 컴포넌트들을 렌더링하도록 합니다.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
