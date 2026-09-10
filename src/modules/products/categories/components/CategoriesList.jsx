import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useShallow } from 'zustand/react/shallow';

import AppTable from '@/shared/AppTable';
import { Badge } from '@/shared/ui/badge';
import { Card, CardContent } from '@/shared/ui/card';

import CategoryCreate from './CategoryCreate';
import CategoryDelete from './CategoryDelete';
import CategoryUpdate from './CategoryUpdate';
import { getListCategories } from '../categories.processes';
import { useCategoriesStore } from '../categories.store';

const CategoriesList = () => {
  const { categories, loading, error } = useCategoriesStore(
    useShallow((state) => ({
      categories: state.categories,
      loading: state.loading,
      error: state.error,
    })),
  );

  useEffect(() => {
    getListCategories();
  }, []);

  const columns = [
    {
      accessorKey: 'name',
      header: 'Название',
      cell: ({ getValue }) => <span className="text-sm font-medium">{getValue()}</span>,
    },
    {
      accessorKey: 'description',
      header: 'Описание',
      cell: ({ getValue }) => <span className="text-sm">{getValue()}</span>,
    },
    {
      accessorKey: 'isActive',
      header: 'Статус',
      cell: ({ getValue }) =>
        getValue() ? (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">Активна</Badge>
        ) : (
          <Badge variant="secondary">Не активна</Badge>
        ),
    },
    {
      id: 'actions',
      header: 'Действия',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CategoryUpdate category={row.original} />
          <CategoryDelete category={row.original} />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <CardContent>
        {loading.list ? (
          <div className="flex justify-center p-10">
            <Loader2 className="animate-spin" />
          </div>
        ) : error.list ? (
          <p className="text-destructive p-10 text-center">Ошибка получения категорий</p>
        ) : (
          <AppTable data={categories} columns={columns} />
        )}
      </CardContent>
    </Card>
  );
};

export default CategoriesList;
