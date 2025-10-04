import React, { useState, useEffect, useCallback } from 'react';
import { 
  DndContext, 
  DragEndEvent, 
  DragOverlay, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useParams, useNavigate } from 'react-router-dom';
import Column from './Column';
import TaskModal from './TaskModal';
import { Task, TaskStatus } from '../../types/Task';

const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const { currentUser } = useAuth();
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const fetchTasks = useCallback(async () => {
    if (!currentUser || !boardId) {
      console.log('Missing currentUser or boardId:', { currentUser: !!currentUser, boardId });
      return;
    }

    console.log('Fetching tasks for:', { userId: currentUser.uid, boardId });

    try {
      // First, let's try to fetch all tasks to see if there are any
      const allTasksRef = collection(db, 'tasks');
      const allTasksSnapshot = await getDocs(allTasksRef);
      console.log('All tasks in database:', allTasksSnapshot.docs.length);
      allTasksSnapshot.docs.forEach(doc => {
        console.log('All task:', { id: doc.id, ...doc.data() });
      });

      // Test if we can write to Firestore (this will help debug security rules)
      try {
        const testRef = collection(db, 'test');
        await addDoc(testRef, { test: 'test', userId: currentUser.uid, timestamp: new Date() });
        console.log('Test write successful - Firestore write permissions OK');
      } catch (writeError) {
        console.error('Test write failed - Firestore write permissions issue:', writeError);
      }

      const tasksRef = collection(db, 'tasks');
      const q = query(
        tasksRef, 
        where('boardId', '==', boardId),
        where('userId', '==', currentUser.uid)
      );
      const querySnapshot = await getDocs(q);
      
      console.log('Filtered query snapshot size:', querySnapshot.docs.length);
      
      const tasksData = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Task data:', { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          dueDate: data.dueDate?.toDate() || null
        };
      }) as Task[];
      
      // Sort tasks by createdAt in descending order (newest first)
      tasksData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
      console.log('Processed tasks:', tasksData);
      setTasks(tasksData);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  }, [currentUser, boardId]);

  useEffect(() => {
    console.log('KanbanBoard useEffect triggered:', { boardId, currentUser: !!currentUser });
    if (boardId) {
      fetchTasks();
    }
  }, [boardId, fetchTasks, currentUser]);

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    console.log('Drag started:', active.id);
    const task = tasks.find(t => t.id === active.id);
    setActiveTask(task || null);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    
    console.log('Drag ended:', { active: active.id, over: over?.id });
    
    if (!over) {
      console.log('No drop target');
      setActiveTask(null);
      return;
    }

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) {
      console.log('Active task not found');
      setActiveTask(null);
      return;
    }

    const newStatus = over.id as TaskStatus;
    console.log('Moving task from', activeTask.status, 'to', newStatus);
    
    if (activeTask.status !== newStatus) {
      try {
        await updateDoc(doc(db, 'tasks', activeTask.id), {
          status: newStatus
        });
        
        setTasks(prev => 
          prev.map(task => 
            task.id === activeTask.id 
              ? { ...task, status: newStatus }
              : task
          )
        );
        console.log('Task status updated successfully');
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }

    setActiveTask(null);
  };

  const handleCreateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'boardId'>) => {
    if (!currentUser || !boardId) {
      console.log('Cannot create task: missing currentUser or boardId', { currentUser: !!currentUser, boardId });
      return;
    }

    console.log('Creating task with data:', taskData);
    console.log('User ID:', currentUser.uid);
    console.log('Board ID:', boardId);

    try {
      const taskToSave = {
        ...taskData,
        userId: currentUser.uid,
        boardId,
        createdAt: new Date()
      };
      
      console.log('Saving task to Firestore:', taskToSave);
      
      const docRef = await addDoc(collection(db, 'tasks'), taskToSave);
      console.log('Task created with ID:', docRef.id);

      const newTask: Task = {
        id: docRef.id,
        ...taskData,
        userId: currentUser.uid,
        boardId,
        createdAt: new Date()
      };

      console.log('Adding task to local state:', newTask);
      setTasks(prev => [newTask, ...prev]);
      setShowTaskModal(false);
      
      // Refresh tasks from database to confirm
      setTimeout(() => {
        console.log('Refreshing tasks after creation...');
        fetchTasks();
      }, 1000);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleUpdateTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'userId' | 'boardId'>) => {
    if (!editingTask) return;

    try {
      await updateDoc(doc(db, 'tasks', editingTask.id), {
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        dueDate: taskData.dueDate
      });

      const updatedTask: Task = {
        ...editingTask,
        ...taskData
      };

      setTasks(prev => 
        prev.map(task => 
          task.id === editingTask.id ? updatedTask : task
        )
      );
      setShowTaskModal(false);
      setEditingTask(null);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteDoc(doc(db, 'tasks', taskId));
      setTasks(prev => prev.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="glass rounded-2xl p-6 mb-8 shadow-modern-lg animate-fade-in">
          <div className="flex justify-between items-center">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-xl hover:bg-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Dashboard
            </button>
            <h1 className="text-4xl font-bold text-white">Kanban Board</h1>
            <button
              onClick={() => setShowTaskModal(true)}
              className="gradient-secondary text-white px-8 py-4 rounded-xl hover:shadow-modern-lg transition-all duration-300 font-semibold transform hover:scale-105"
            >
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Task
              </span>
            </button>
          </div>
        </div>
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="animate-slide-up">
              <Column
                status="todo"
                tasks={getTasksByStatus('todo')}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <Column
                status="in-progress"
                tasks={getTasksByStatus('in-progress')}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
            <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <Column
                status="done"
                tasks={getTasksByStatus('done')}
                onEditTask={handleEditTask}
                onDeleteTask={handleDeleteTask}
              />
            </div>
          </div>

          {/* Temporarily disabled DragOverlay to test */}
          {/* <DragOverlay>
            {activeTask ? (
              <div className="bg-white rounded-lg shadow-xl border-2 border-blue-500 p-3 cursor-grabbing transform rotate-2">
                <div className="text-sm font-medium text-gray-900 mb-1">{activeTask.title}</div>
                {activeTask.description && (
                  <div className="text-xs text-gray-600 mb-2">{activeTask.description}</div>
                )}
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded ${
                    activeTask.priority === 'high' ? 'bg-red-100 text-red-700' :
                    activeTask.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {activeTask.priority}
                  </span>
                  {activeTask.dueDate && (
                    <span className="text-xs text-gray-500">
                      {activeTask.dueDate.toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            ) : null}
          </DragOverlay> */}
        </DndContext>
      </div>

      {showTaskModal && (
        <TaskModal
          onClose={() => {
            setShowTaskModal(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleUpdateTask : handleCreateTask}
          task={editingTask}
        />
      )}
    </div>
  );
};

export default KanbanBoard;
