import { buildQueryKeyWithAccountIds } from '@/utils';
import { checkIsNull } from '@/utils/advertising.utils';
import {
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueries,
  useQuery,
  UseQueryOptions,
  UseQueryResult,
} from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useMemo } from 'react';
import { useAppSelector } from './hooks';
import {
  selectAccountId,
  selectAdvertisingAccount,
  selectCatalogAccount,
} from './slices/auth/auth.slice';

/* useQuery Custom Hook */
export type UseAppQueryProps<TData, TError> = {
  queryKey: any[];
  queryFn: QueryFunction<TData>;
  enabled?: boolean;
  options?: Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn'>;
};

export function useAppQuery<TData = unknown, TError = AxiosError>({
  queryKey,
  queryFn,
  enabled = true,
  options = {},
}: UseAppQueryProps<TData, TError>) {
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedCatalogAccount = useAppSelector(selectCatalogAccount);
  const selectedAccountId = useAppSelector(selectAccountId);

  const selectedAdvertisingAccountId = useMemo(
    () => selectedAdvertisingAccount.value,
    [selectedAdvertisingAccount]
  );

  const selectedCatalogAccountId = useMemo(
    () => selectedCatalogAccount.value,
    [selectedCatalogAccount.value]
  );

  return useQuery<TData, TError>({
    queryKey: buildQueryKeyWithAccountIds(
      queryKey,
      selectedAccountId,
      selectedAdvertisingAccountId,
      selectedCatalogAccountId
    ),
    queryFn,
    enabled,

    ...options,
  });
}

/* useQueries Custom Hook */
export function useAppQueries<
  TQueries extends readonly UseAppQueryProps<any, any>[]
>(
  queries: TQueries
): {
  [K in keyof TQueries]: UseQueryResult<
    TQueries[K]['queryFn'] extends () => Promise<infer R> ? R : unknown,
    any
  >;
} {
  const selectedAdvertisingAccount = useAppSelector(selectAdvertisingAccount);
  const selectedCatalogAccount = useAppSelector(selectCatalogAccount);
  const selectedAccountId = useAppSelector(selectAccountId);

  const selectedAdvertisingAccountId = useMemo(
    () => selectedAdvertisingAccount.value,
    [selectedAdvertisingAccount]
  );

  const selectedCatalogAccountId = useMemo(
    () => selectedCatalogAccount.value,
    [selectedCatalogAccount.value]
  );
  return useQueries({
    queries: queries.map(
      ({ queryKey, queryFn, enabled = true, options = {} }) => ({
        queryKey: buildQueryKeyWithAccountIds(
          queryKey,
          selectedAccountId,
          selectedAdvertisingAccountId,
          selectedCatalogAccountId
        ),
        queryFn,
        enabled: Boolean(enabled),
        ...options,
      })
    ),
  }) as {
    [K in keyof TQueries]: UseQueryResult<
      TQueries[K]['queryFn'] extends () => Promise<infer R> ? R : unknown,
      any
    >;
  };
}

/* useMutation Custom Hook */
type UseAppMutationProps<TData, TError, TVariables> = {
  mutationFn: MutationFunction<TData, TVariables>;
  options?: UseMutationOptions<TData, TError, TVariables>;
};

export function useAppMutation<
  TData = unknown,
  TError = AxiosError,
  TVariables = void
>({
  mutationFn,
  options,
}: UseAppMutationProps<TData, TError, TVariables>): UseMutationResult<
  TData,
  TError,
  TVariables
> {
  return useMutation<TData, TError, TVariables>({ mutationFn, ...options });
}

export const invalidateQueries = (
  queryClient: QueryClient,
  queryKeys: QueryKey
) => {
  if (checkIsNull(queryKeys)) return;
  for (const key of queryKeys)
    queryClient.invalidateQueries({
      queryKey: [key],
    });
};
