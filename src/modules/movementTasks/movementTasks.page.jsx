import React, { useEffect } from 'react';
import { useLocation } from 'react-router';

import { PAGE_TITLES } from '@/constants/routes';

import MovementTasksFilter from './components/MovementTasksFilter';
import MovementTasksList from './components/MovementTasksList';
import { getMovementTasksList,getMovementTaskTypes } from './movementTasks.processes';

function MovementTasksPage() {
  const { pathname } = useLocation();

  useEffect(() => {
    getMovementTaskTypes();
    getMovementTasksList();
  }, []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold">{PAGE_TITLES[pathname]}</h1>
        <p className="text-muted-foreground">Управление заданиями на пополнение точек продаж</p>
      </div>

      <MovementTasksFilter />
      <MovementTasksList />
    </div>
  );
}

export const Component = MovementTasksPage;
