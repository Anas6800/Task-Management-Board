import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Task } from '../../types/Task';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging,
  } = useDraggable({ 
    id: task.id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      default:
        return 'bg-white/20 text-white/80 border-white/30';
    }
  };

  const isOverdue = task.dueDate && new Date() > task.dueDate;

  return (
    <>
      {/* Ghost element for original position */}
      {isDragging && (
        <div className="opacity-0">
          <div className="glass rounded-xl p-4">
            {/* This maintains the space in the original column */}
          </div>
        </div>
      )}
      
      {/* Draggable element */}
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className={`touch-none ${isDragging ? 'fixed z-50 pointer-events-none' : 'relative'}`}
      >
        <div
          className={`glass rounded-xl p-4 cursor-grab active:cursor-grabbing hover:bg-white/20 transition-all duration-200 shadow-modern border border-white/20 group hover:shadow-modern-lg w-full ${
            isDragging ? 'shadow-2xl rotate-2 opacity-90' : ''
          } ${isOverdue ? 'border-red-500/50' : ''}`}
        >
          <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-white text-sm group-hover:text-white/90 transition-colors">{task.title}</h4>
            {!isDragging && (
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(task);
                  }}
                  className="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-2 py-1 rounded-lg transition-all duration-200 text-xs font-medium border border-blue-500/30"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Are you sure you want to delete this task?')) {
                      onDelete(task.id);
                    }
                  }}
                  className="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-2 py-1 rounded-lg transition-all duration-200 text-xs font-medium border border-red-500/30"
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            )}
          </div>
          
          {task.description && (
            <p className="text-white/80 text-xs mb-3 line-clamp-2">
              {task.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <span className={`text-xs px-2 py-1 rounded-lg border ${getPriorityColor(task.priority)}`}>
              {task.priority}
            </span>
            
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${
                isOverdue ? 'text-red-300 font-medium' : 'text-white/60'
              }`}>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {task.dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TaskCard;