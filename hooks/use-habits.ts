import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Habit } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

export const useHabits = () => {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  // Fetch habits
  const fetchHabits = async (): Promise<Habit[]> => {
    if (!user) return []

    const { data, error } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  }

  // Create habit
  const createHabitFn = async (habitData: {
    title: string
    subtitle: string
    icon: string
  }): Promise<Habit> => {
    if (!user) throw new Error('No user found')

    const { data, error } = await supabase
      .from('habits')
      .insert({
        ...habitData,
        user_id: user.id,
        completed: false,
      })
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Toggle habit completion
  const toggleHabitFn = async (habitId: string): Promise<Habit> => {
    if (!user) throw new Error('No user found')

    // Get current habits to find the one we're updating
    const currentHabits = queryClient.getQueryData<Habit[]>(['habits', user.id]) || []
    const habit = currentHabits.find(h => h.id === habitId)
    if (!habit) throw new Error('Habit not found')

    const { data, error } = await supabase
      .from('habits')
      .update({ 
        completed: !habit.completed,
        updated_at: new Date().toISOString()
      })
      .eq('id', habitId)
      .eq('user_id', user.id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  // Delete habit
  const deleteHabitFn = async (habitId: string): Promise<void> => {
    if (!user) throw new Error('No user found')

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', habitId)
      .eq('user_id', user.id)

    if (error) throw error
  }

  // Queries and mutations
  const {
    data: habits = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['habits', user?.id],
    queryFn: fetchHabits,
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  })

  const createHabitMutation = useMutation({
    mutationFn: createHabitFn,
    onMutate: async (newHabitData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habits', user?.id] })

      // Snapshot the previous value
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', user?.id])

      // Optimistically update to the new value
      const optimisticHabit: Habit = {
        id: `temp-${Date.now()}`, // Temporary ID
        title: newHabitData.title,
        subtitle: newHabitData.subtitle,
        icon: newHabitData.icon,
        completed: false,
        user_id: user?.id || '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      queryClient.setQueryData<Habit[]>(['habits', user?.id], old => 
        old ? [optimisticHabit, ...old] : [optimisticHabit]
      )

      // Return a context object with the snapshotted value
      return { previousHabits }
    },
    onError: (err, newHabit, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(['habits', user?.id], context?.previousHabits)
    },
    onSuccess: (data) => {
      // Replace the optimistic update with the real data
      queryClient.setQueryData<Habit[]>(['habits', user?.id], old => {
        if (!old) return [data]
        // Replace the temporary item with the real one
        const withoutTemp = old.filter(habit => !habit.id.startsWith('temp-'))
        return [data, ...withoutTemp]
      })
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] })
    },
  })

  const toggleHabitMutation = useMutation({
    mutationFn: toggleHabitFn,
    onMutate: async (habitId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habits', user?.id] })

      // Snapshot the previous value
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', user?.id])

      // Optimistically update
      queryClient.setQueryData<Habit[]>(['habits', user?.id], old => 
        old ? old.map(habit => 
          habit.id === habitId 
            ? { ...habit, completed: !habit.completed }
            : habit
        ) : []
      )

      return { previousHabits }
    },
    onError: (err, habitId, context) => {
      // Rollback on error
      queryClient.setQueryData(['habits', user?.id], context?.previousHabits)
    },
    onSettled: () => {
      // Refetch to ensure we're in sync
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] })
    },
  })

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabitFn,
    onMutate: async (habitId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['habits', user?.id] })

      // Snapshot the previous value
      const previousHabits = queryClient.getQueryData<Habit[]>(['habits', user?.id])

      // Optimistically remove the habit
      queryClient.setQueryData<Habit[]>(['habits', user?.id], old => 
        old ? old.filter(habit => habit.id !== habitId) : []
      )

      return { previousHabits }
    },
    onError: (err, habitId, context) => {
      // Rollback on error
      queryClient.setQueryData(['habits', user?.id], context?.previousHabits)
    },
    onSettled: () => {
      // Refetch to ensure we're in sync
      queryClient.invalidateQueries({ queryKey: ['habits', user?.id] })
    },
  })

  // Real-time subscription (simplified)
  // useEffect(() => {
  //   if (!user) return

  //   const subscription = supabase
  //     .channel(`habits_changes_${user.id}`)
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: '*',
  //         schema: 'public',
  //         table: 'habits',
  //         filter: `user_id=eq.${user.id}`,
  //       },
  //       () => {
  //         // Just invalidate queries - let TanStack Query handle the rest
  //         queryClient.invalidateQueries({ queryKey: ['habits', user.id] })
  //       }
  //     )
  //     .subscribe()

  //   return () => subscription.unsubscribe()
  // }, [user?.id, queryClient])

  return {
    habits,
    loading,
    error: error?.message || null,
    createHabit: createHabitMutation.mutateAsync,
    toggleHabit: toggleHabitMutation.mutateAsync,
    deleteHabit: deleteHabitMutation.mutateAsync,
    refetch,
  }
}