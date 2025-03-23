"use client";

import AddProjectModal from "@/components/projects/AddProjectModal";
import FilterTable from "@/components/projects/FilterTable";
import InfoTable from "@/components/projects/InfoTable";
import PaginationButtons from "@/components/projects/PaginationButtons";
import ProjectListTable from "@/components/projects/ProjectListTable";
import SearchForm from "@/components/projects/SearchForm";
import { ProjectType } from "@/types/projectType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectManagement() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [selectedPage, setSelectedPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [projects, setProjects] = useState<Array<ProjectType>>([]);

  const [addModelVisible, setAddModelVisible] = useState(false);
  const [editModelVisible, setEditModelVisible] = useState(false);

  useEffect(() => {
    (async () => {
      const response = await axios.get(
        `http://localhost:5110/api/projects/all?page=${selectedPage}`
      );
      if (response.status) {
        if (!response.data.length) setSelectedPage(selectedPage - 1);
        setProjects(response.data);
      }
    })();
  }, [selectedPage]);

  return (
    <div className="w-11/12 mx-auto">
      {!projects.length ? (
        <div className="ml-5"> Loading... </div>
      ) : (
        <div className="dark:bg-gray-900 text-gray-800 dark:text-white">
          <h2 className="text-2xl font-semibold mb-4">Project Management</h2>

          <AddProjectModal {...{ addModelVisible, setAddModelVisible }} />

          {/* General Infos */}
          <InfoTable />

          {/* Filter Section */}
          <FilterTable />

          {/* Search Section */}
          <SearchForm
            {...{
              addModelVisible,
              editModelVisible,
              setAddModelVisible,
              setEditModelVisible,
            }}
          />

          {/* Projects List */}
          <ProjectListTable
            {...{
              projects,
              addModelVisible,
              editModelVisible,
              setAddModelVisible,
              setEditModelVisible,
            }}
          />

          {/* Pagination Section */}
          <PaginationButtons {...{ selectedPage, setSelectedPage }} />
        </div>
      )}
    </div>
  );
}
