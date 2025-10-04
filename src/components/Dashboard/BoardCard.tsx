import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../../types/Board';

interface BoardCardProps {
  board: Board;
  onDelete: (boardId: string) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, onDelete }) => {
  const navigate = useNavigate();

  const handleBoardClick = () => {
    navigate(`/board/${board.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this board?')) {
      onDelete(board.id);
    }
  };

  return (
    <div
      onClick={handleBoardClick}
      className="glass rounded-2xl p-6 cursor-pointer hover:bg-white/20 transition-all duration-300 shadow-modern border border-white/20 group hover:shadow-modern-lg hover:scale-105"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 gradient-secondary rounded-xl flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-white group-hover:text-white/90 transition-colors">{board.name}</h3>
            <p className="text-white/60 text-sm">Click to open</p>
          </div>
        </div>
        <button
          onClick={handleDelete}
          className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium border border-red-500/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      
      {board.description && (
        <p className="text-white/80 text-sm mb-4 line-clamp-2">{board.description}</p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-white/60 text-xs">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Created {board.createdAt.toLocaleDateString()}
        </div>
        <div className="flex items-center gap-1 text-white/60">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default BoardCard;
