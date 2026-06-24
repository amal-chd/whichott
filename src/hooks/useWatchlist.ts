import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/context/AuthContext';
import {
  addToWatchlist,
  removeFromWatchlist,
  updateWatchlistStatus,
  updateWatchlistInteraction,
  getUserWatchlist,
  getWatchlistItem
} from '@/lib/firebase/watchlist';
import type { WatchlistStatus } from '@/lib/firebase/watchlist';
import type { ContentType } from '@/lib/api/types';

export function useWatchlist() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const watchlistQuery = useQuery({
    queryKey: ['watchlist', user?.uid],
    queryFn: () => getUserWatchlist(user!.uid),
    enabled: !!user,
  });

  const addItemMutation = useMutation({
    mutationFn: (params: { mediaId: number; mediaType: ContentType; title: string; posterPath: string | null; status?: WatchlistStatus }) => 
      addToWatchlist(user!.uid, params.mediaId, params.mediaType, params.title, params.posterPath, params.status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['watchlistItem', user?.uid, variables.mediaId] });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: (params: { mediaId: number; status: WatchlistStatus }) => 
      updateWatchlistStatus(user!.uid, params.mediaId, params.status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['watchlistItem', user?.uid, variables.mediaId] });
    }
  });

  const updateInteractionMutation = useMutation({
    mutationFn: (params: { mediaId: number; seen?: boolean; liked?: boolean | null }) => 
      updateWatchlistInteraction(user!.uid, params.mediaId, { seen: params.seen, liked: params.liked }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['watchlistItem', user?.uid, variables.mediaId] });
    }
  });

  const removeItemMutation = useMutation({
    mutationFn: (mediaId: number) => removeFromWatchlist(user!.uid, mediaId),
    onSuccess: (_, mediaId) => {
      queryClient.invalidateQueries({ queryKey: ['watchlist', user?.uid] });
      queryClient.invalidateQueries({ queryKey: ['watchlistItem', user?.uid, mediaId] });
    }
  });

  return {
    watchlist: watchlistQuery.data || [],
    isLoading: watchlistQuery.isLoading,
    addItem: addItemMutation.mutateAsync,
    updateStatus: updateItemMutation.mutateAsync,
    updateInteraction: updateInteractionMutation.mutateAsync,
    removeItem: removeItemMutation.mutateAsync,
    isMutating: addItemMutation.isPending || updateItemMutation.isPending || updateInteractionMutation.isPending || removeItemMutation.isPending
  };
}

/**
 * Separate hook for checking a single watchlist item.
 * Must be called at the top level of a component (follows Rules of Hooks).
 */
export function useWatchlistItem(mediaId: number) {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['watchlistItem', user?.uid, mediaId],
    queryFn: () => getWatchlistItem(user!.uid, mediaId),
    enabled: !!user && !!mediaId,
  });
}
