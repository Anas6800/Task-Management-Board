import React, { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import BoardCard from './BoardCard';
import CreateBoardModal from './CreateBoardModal';
import { Board } from '../../types/Board';

const Dashboard: React.FC = () => {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const fetchBoards = useCallback(async () => {
    if (!currentUser) return;
    
    try {
      const boardsRef = collection(db, 'boards');
      const q = query(boardsRef, where('userId', '==', currentUser.uid));
      const querySnapshot = await getDocs(q);
      
      const boardsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      })) as Board[];
      
      setBoards(boardsData);
    } catch (error) {
      console.error('Error fetching boards:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchBoards();
  }, [fetchBoards]);

  const handleCreateBoard = async (name: string, description: string) => {
    if (!currentUser) return;

    try {
      const docRef = await addDoc(collection(db, 'boards'), {
        name,
        description,
        userId: currentUser.uid,
        createdAt: new Date()
      });
      
      const newBoard: Board = {
        id: docRef.id,
        name,
        description,
        createdAt: new Date(),
        userId: currentUser.uid
      };
      
      setBoards(prev => [...prev, newBoard]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating board:', error);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    try {
      await deleteDoc(doc(db, 'boards', boardId));
      setBoards(prev => prev.filter(board => board.id !== boardId));
    } catch (error) {
      console.error('Error deleting board:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen gradient-primary flex items-center justify-center">
        <div className="glass rounded-full p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-white/20 border-t-white"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="glass rounded-2xl p-8 mb-8 shadow-modern-lg animate-fade-in">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">My Boards</h1>
              <p className="text-white/80 text-lg">Organize your projects with beautiful boards</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-xl hover:bg-white/30 transition-all duration-300 shadow-modern border border-white/20 font-semibold"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create New Board
              </span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {boards.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center shadow-modern-lg animate-slide-up">
            <div className="text-white/60 mb-6">
              <svg className="mx-auto h-20 w-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">No boards yet</h3>
            <p className="text-white/80 text-lg mb-8">Get started by creating your first beautiful board</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="gradient-secondary text-white px-8 py-4 rounded-xl hover:shadow-modern-lg transition-all duration-300 font-semibold transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Board
              </span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {boards.map((board, index) => (
              <div key={board.id} className="animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                <BoardCard
                  board={board}
                  onDelete={handleDeleteBoard}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 flex justify-between items-center">
          <div className="glass rounded-xl px-6 py-3">
            <p className="text-white/80 text-sm">Welcome back, {currentUser?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 backdrop-blur-sm text-white px-6 py-3 rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20"
          >
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </span>
          </button>
        </div>
      </div>

      {showCreateModal && (
        <CreateBoardModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateBoard}
        />
      )}
    </div>
  );
};

export default Dashboard;
