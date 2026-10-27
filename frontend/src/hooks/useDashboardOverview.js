import { useEffect, useState } from 'react';
import {
  getAdminStats,
  getAdminBookInventory,
  getAdminBookRequests,
  getAdminSubmissions,
} from '../services/api';

/** Load the admin overview metrics and latest activity independently. */
export default function useDashboardOverview() {
  const [overviewStats, setOverviewStats] = useState({
    totalBooks: undefined,
    totalBookRequests: undefined,
    totalEssays: undefined,
    totalDonations: undefined,
    pendingRequests: undefined,
    approvedRequests: undefined,
    fulfilledRequests: undefined,
  });

  const [overviewLoading, setOverviewLoading] = useState(false);

  const [overviewError, setOverviewError] = useState("");

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    let cancelled = false;

    const fetchOverviewStats = async () => {
      setOverviewLoading(true);
      setOverviewError("");

      const results = await Promise.allSettled([
        getAdminStats(),

        getAdminBookInventory({
          page: 1,
          limit: 1,
        }),

        getAdminBookRequests({
          page: 1,
          limit: 1,
        }),

        getAdminBookRequests({
          page: 1,
          limit: 1,
          status: "Pending",
        }),

        getAdminBookRequests({
          page: 1,
          limit: 1,
          status: "Approved",
        }),

        getAdminBookRequests({
          page: 1,
          limit: 1,
          status: "Fulfilled",
        }),
      ]);

      if (cancelled) return;

      const [
        statsResult,
        booksResult,
        requestsResult,
        pendingResult,
        approvedResult,
        fulfilledResult,
      ] = results;

      const getTotal = (result) => {
        if (result.status !== "fulfilled") {
          return undefined;
        }

        const value = result.value?.data?.total;

        return typeof value === "number" &&
          Number.isFinite(value)
          ? value
          : undefined;
      };

      const getStat = (result, field) => {
        if (result.status !== "fulfilled") {
          return undefined;
        }

        const value = result.value?.data?.stats?.[field];

        return typeof value === "number" &&
          Number.isFinite(value)
          ? value
          : undefined;
      };

      setOverviewStats({
        totalBooks: getTotal(booksResult),
        totalBookRequests: getTotal(requestsResult),

        totalEssays: getStat(
          statsResult,
          "totalEssays"
        ),

        totalDonations: getStat(
          statsResult,
          "totalDonations"
        ),

        pendingRequests: getTotal(pendingResult),

        approvedRequests: getTotal(approvedResult),

        fulfilledRequests: getTotal(fulfilledResult),
      });
      const failedRequests = results.filter(
        (result) => result.status === "rejected"
      );

      if (failedRequests.length > 0) {
        console.error(
          "Some dashboard statistics could not be loaded:",
          failedRequests.map((result) => result.reason)
        );

        setOverviewError(
          "Some dashboard statistics are temporarily unavailable."
        );
      }

      setOverviewLoading(false);
    };

    fetchOverviewStats();

    return () => {
      cancelled = true;
    };
  }, []);

  // Recent activity is assembled from the existing admin APIs.
  // Keep this independent of the statistics request so a partial failure
  // does not prevent the overview from rendering.
  useEffect(() => {
    let cancelled = false;

    const fetchRecentActivity = async () => {
      const results = await Promise.allSettled([
        getAdminBookRequests({ page: 1, limit: 5 }),
        getAdminSubmissions('essays'),
        getAdminSubmissions('donations'),
      ]);

      if (cancelled) return;

      const [requestsResult, essaysResult, donationsResult] = results;
      const activity = [];

      const extractRecords = (result) => {
        if (result.status !== 'fulfilled') return [];
        const payload = result.value?.data;
        if (Array.isArray(payload?.data)) return payload.data;
        if (Array.isArray(payload?.submissions)) return payload.submissions;
        return [];
      };

      extractRecords(requestsResult).forEach((request) => {
        activity.push({
          id: `request-${request._id}`,
          title: 'New Book Request',
          description: `A reader requested ${request.book?.title || 'a book'}.`,
          date: request.createdAt,
        });
      });

      extractRecords(essaysResult).forEach((essay) => {
        activity.push({
          id: `essay-${essay._id}`,
          title: 'New Essay Submission',
          description: `An essay titled "${essay.essayTitle || 'Untitled Essay'}" was submitted.`,
          date: essay.createdAt,
        });
      });

      extractRecords(donationsResult).forEach((donation) => {
        const bookCount = Number(donation.numberOfBooks);
        activity.push({
          id: `donation-${donation._id}`,
          title: 'New Book Donation',
          description: Number.isFinite(bookCount) && bookCount > 0
            ? `A donation of ${bookCount} ${bookCount === 1 ? 'book' : 'books'} was submitted.`
            : 'A new book donation was submitted.',
          date: donation.createdAt,
        });
      });

      const latestActivity = activity
        .filter((item) => item.date && !Number.isNaN(new Date(item.date).getTime()))
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

      setRecentActivity(latestActivity);

      const failures = results.filter((result) => result.status === 'rejected');
      if (failures.length) {
        console.error('Some recent activity could not be loaded:', failures.map((result) => result.reason));
      }
    };

    fetchRecentActivity();
    return () => { cancelled = true; };
  }, []);

  return {
    overviewStats,
    overviewLoading,
    overviewError,
    recentActivity,
  };
}
