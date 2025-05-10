"use client";

import FilterTable from "@/components/projects/FilterTable";
import PaginationButtons from "@/components/projects/PaginationButtons";
import ProjectListTable from "@/components/projects/ProjectListTable";
import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import UserSearchForm from "@/components/projects/UserSearchForm";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function UserProjects() {
  const searchParams = useSearchParams();

  const [selectedPage, setSelectedPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [projects, setProjects] = useState<Array<ProjectType>>([]);

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    projectType: "",
    manager: "",
    process: "",
    priority: "",
  });

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const [managers, setManagers] = useState<UserType[]>([]);

  const fetchProjects = async () => {
    if (selectedPage != 0 && currentUser) {
      try {
        const response = await axios.get(
          `http://localhost:5110/api/projects/user-projects?userId=${currentUser.id}`,
          {
            params: {
              page: selectedPage,
              ...filters,
              search,
            },
          }
        );

        console.log('naber',response.data);

        if (response.status) {
          if (!response.data.projectDtos.length && selectedPage != 1) {
            setSelectedPage(selectedPage - 1);
          }
          setProjects(response.data.projectDtos);
          setManagers(response.data.managers);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };


  useEffect(() => {
    (async () => {
      await fetchProjects();
    })();
  }, [selectedPage,currentUser]);

  return (
    <div className="w-11/12 mx-auto">
      <div className="dark:bg-gray-900 text-gray-800 dark:text-white">
        <h2 className="text-2xl font-semibold mb-4">Project Management</h2>

        {/* Filter Section */}
        <FilterTable {...{ filters, setFilters, managers }} />

        {/* Search Section */}
        <UserSearchForm
          {...{
            search,
            setSearch,
            fetchProjects,
          }}
        />

        {/* Projects List */}
        <ProjectListTable
          {...{
            projects,
          }}
        />

        {/* Pagination Section */}
        <PaginationButtons {...{ selectedPage, setSelectedPage }} />
      </div>
    </div>
  );
}
