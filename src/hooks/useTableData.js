import { useState, useEffect, useMemo, useRef } from 'react';

export const useTableData = (fetchFunction, initialParams = {}) => {
  const [data, setData] = useState([]);
  const [metadata, setMetadata] = useState({ total: 0, page: 1, limit: 10, pages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [params, setParams] = useState({ pageNo: 1, limitNo: 10, search: '', ...initialParams });
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => { isMounted.current = false; };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchFunction(params);
        const result = response.data[0];
        if (isMounted.current) {
          setData(result.data || []);
          setMetadata(result.metadata || { total: 0, page: 1, limit: 10, pages: 1 });
        }
      } catch (err) {
        if (isMounted.current) {
          setError(err.message || 'Failed to fetch data');
          setData([]);
        }
      } finally {
        if (isMounted.current) {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [params.pageNo, params.limitNo, params.search, params.account_type]);

  const setPage = (page) => setParams(prev => ({ ...prev, pageNo: page }));
  const setLimit = (limit) => setParams(prev => ({ ...prev, limitNo: limit, pageNo: 1 }));
  const setSearch = (search) => setParams(prev => ({ ...prev, search, pageNo: 1 }));
  const refetch = () => setParams(prev => ({ ...prev }));

  return {
    data,
    metadata,
    loading,
    error,
    params,
    setPage,
    setLimit,
    setSearch,
    refetch
  };
};
