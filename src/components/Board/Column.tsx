import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Task, TaskStatus } from '../../types/Task';
import TaskCard from './TaskCard';

interface ColumnProps {
  status: TaskStatus;
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const Column: React.FC<ColumnProps> = ({ status, tasks, onEditTask, onDeleteTask }) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  // Debug logging
  React.useEffect(() => {
    if (isOver) {
      console.log(`Column ${status} is being hovered over`);
    }
  }, [isOver, status]);

  const getStatusInfo = (status: TaskStatus) => {
    switch (status) {
      case 'todo':
        return {
          title: 'To Do',
          gradient: 'gradient-primary',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          )
        };
      case 'in-progress':
        return {
          title: 'In Progress',
          gradient: 'gradient-secondary',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
      case 'done':
        return {
          title: 'Done',
          gradient: 'gradient-success',
          icon: (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )
        };
    }
  };

  const statusInfo = getStatusInfo(status);

  return (
    <div className="flex flex-col">
      <div 
        ref={setNodeRef}
        className={`glass rounded-2xl p-6 min-h-[700px] transition-all duration-300 ${
          isOver ? 'ring-2 ring-white/50 ring-opacity-50 bg-white/20' : ''
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${statusInfo.gradient} rounded-xl flex items-center justify-center text-white`}>
              {statusInfo.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {statusInfo.title}
              </h3>
              <p className="text-white/60 text-sm">Drop tasks here</p>
            </div>
          </div>
          <span className="bg-white/20 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold border border-white/20">
            {tasks.length}
          </span>
        </div>
        
        <div className="space-y-4">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
          {tasks.length === 0 && (
            <div className="text-center py-12">
              <div className="text-white/40 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-white/60 text-sm">No tasks yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Column;
