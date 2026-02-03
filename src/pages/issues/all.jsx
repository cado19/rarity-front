import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Mosaic } from "react-loading-indicators";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { get_all_issues } from "../../api/fetch";
import IssueNav from "../../components/navs/issueNav";
import BasicTable from "../../components/utility/basicTable";
import { issueColumns } from "../../components/utility/tableColumns";

export default function AllIssues() {


  const [issues, setIssues] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getIssues = async () => {
    try {
      const response = await get_all_issues();
      setIssues(response.data.issues);
      console.log(response);
      //   setVehicles(fetchedVehicles);
    } catch (error) {
      const errorMessage = "Error: " + error.message;
      setError(errorMessage);
      console.log(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getIssues();
  }, []);

  if (error) {
    return (
      <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md">
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md w-full flex items-center justify-center h-full">
        <Mosaic color="#32cd32" size="large" text="Loading..." textColor="" />
      </div>
    );
  }

  return (
    <div className="bg-white px-4 pb-4 rounded border-gray-200 flex-1 shadow-md mt-2 mx-3">
      <IssueNav />

      <h1 className="text-3xl font-bold text-end text-yellow-600 tracking-wide mb-4 mt-2">
        Fleet Maintenance & Repairs
      </h1>

      <BasicTable
        columns={issueColumns}
        data={issues}
        columnFilters={columnFilters}
      />
    </div>
  );
}
