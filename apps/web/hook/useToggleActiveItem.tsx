import { useObserveBalancePool } from '@/lib/stores/balances';
import { useTokenStore } from '@/lib/stores/token';
import { TokenId } from '@proto-kit/library';
import { PoolKey, TokenPair } from 'chain';
import { useState, useEffect } from 'react';

export const useToggleActiveItem = (item: any) => {
  const { getTokenID } = useTokenStore()
  const [pooledBalances, setPooledBalances] = useState<any>(null);
  const [activeItems, setActiveItems] = useState<any[]>([]);

  const tokenA: string = getTokenID("ticker", item.tokenSelectedPool.first.symbol) as string;
  const tokenB: string = getTokenID("ticker", item.tokenSelectedPool.second.symbol) as string;

  const poolKey = PoolKey.fromTokenPair(
    TokenPair.from(TokenId.from(tokenA), TokenId.from(tokenB)),
  ).toBase58();

  const balanceFirst = useObserveBalancePool(tokenA, poolKey);
  const balanceSecond = useObserveBalancePool(tokenB, poolKey);

  useEffect(() => {
    const balance = {
      first: balanceFirst,
      second: balanceSecond,
    };
    setPooledBalances(balance);
  }, [balanceFirst, balanceSecond]);

  const toggleActiveItem = () => {
    setActiveItems((prev: any) =>
      prev.includes(item?.id)
        ? prev.filter((itemId: any) => itemId !== item?.id)
        : [...prev, item?.id]
    );
  };

  return { toggleActiveItem, pooledBalances, activeItems };
};
