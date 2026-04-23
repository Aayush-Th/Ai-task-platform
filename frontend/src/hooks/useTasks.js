import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";
import useDebounce from "./useDebounce";

const useTasks = ({ showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [filters, setFilters] = useState({
    q: "",
    status: "all",
    operation: "all",
    sortBy: "createdAt",
    sortOrder: "desc",
    page: 1,
    limit: 10
  });
  const debouncedQuery = useDebounce(filters.q, 350);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState({ status: [], operation: [], daily: [] });
  const [activity, setActivity] = useState([]);

  const queryParams = useMemo(
    () => ({ ...filters, q: debouncedQuery }),
    [filters, debouncedQuery]
  );

  const fetchTasks = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);

      try {
        const { data } = await axiosClient.get("/tasks", { params: queryParams });
        setTasks(data.data);
        setPagination(data.pagination);
      } catch (error) {
        showToast({
          title: "Failed to load tasks",
          message: error.response?.data?.message || "Please retry shortly.",
          type: "error"
        });
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [queryParams, showToast]
  );

  const fetchDashboardMeta = useCallback(async () => {
    try {
      const [statsRes, activityRes] = await Promise.all([
        axiosClient.get("/tasks/stats"),
        axiosClient.get("/tasks/activity")
      ]);
      setStats(statsRes.data);
      setActivity(activityRes.data);
    } catch (error) {
      // Metadata is non-blocking for core task operations.
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    fetchDashboardMeta();
  }, [fetchDashboardMeta, tasks.length]);

  return {
    tasks,
    setTasks,
    loading,
    refreshing,
    filters,
    setFilters,
    pagination,
    stats,
    activity,
    fetchTasks,
    fetchDashboardMeta
  };
};

export default useTasks;
