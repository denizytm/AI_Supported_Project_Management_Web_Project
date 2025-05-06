"use client";

import AddProjectModal from "@/components/projects/AddProjectModal";
import EditProjectModal from "@/components/projects/EditProjectModal";
import DeleteProjectModal from "@/components/projects/DeleteProjectModal";
import FilterTable from "@/components/projects/FilterTable";
import InfoTable from "@/components/projects/InfoTable";
import PaginationButtons from "@/components/projects/PaginationButtons";
import ProjectListTable from "@/components/projects/ProjectListTable";
import SearchForm from "@/components/projects/SearchForm";
import { ProjectType } from "@/types/projectType";
import { UserType } from "@/types/userType";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectManagement() {
  const searchParams = useSearchParams();

  const [selectedPage, setSelectedPage] = useState(
    Number(searchParams.get("page")) || 1
  );
  const [projects, setProjects] = useState<Array<ProjectType>>([]);
  const [generalInfo, setGeneralInfo] = useState({
    projectCount: 0,
    finishedProjectCount: 0,
    onGoingProjectCount: 0,
    onHoldProjectCount: 0,
  });
  const [projectTypes, setProjectTypes] = useState({
    erp: 0,
    web: 0,
    mobile: 0,
    application: 0,
    ai: 0,
  });

  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    projectType: "",
    manager: "",
    process: "",
    priority: "",
  });

  const [managers, setManagers] = useState<UserType[]>([]);

  const [addModelVisible, setAddModelVisible] = useState(false);
  const [editModelVisible, setEditModelVisible] = useState(false);
  const [deleteModelVisible, setDeleteModelVisible] = useState(false);

  const fetchProjects = async () => {
    if (selectedPage != 0) {
      const response = await axios.get(
        `http://localhost:5110/api/projects/all`,
        {
          params: {
            page: selectedPage,
            ...filters,
            search,
          },
        }
      );

      if (response.status) {
        if (!response.data.projectDtos.length && selectedPage != 1)
          setSelectedPage(selectedPage - 1);
        setProjects(response.data.projectDtos);
        setGeneralInfo(response.data.generalInfos);
        setProjectTypes(response.data.projectTypes);
        setManagers(response.data.managers);
      }
    }
  };

  useEffect(() => {
    (async () => {
      await fetchProjects();
    })();
  }, [selectedPage]);

  return (
    <div className="w-11/12 mx-auto">
      <div className="dark:bg-gray-900 text-gray-800 dark:text-white">
        <h2 className="text-2xl font-semibold mb-4">Project Management</h2>

        <AddProjectModal
          {...{ addModelVisible, setAddModelVisible, fetchProjects }}
        />
        <EditProjectModal
          {...{
            editModelVisible,
            setEditModelVisible,
            projects,
            fetchProjects,
          }}
        />
        <DeleteProjectModal
          {...{
            deleteModelVisible,
            setDeleteModelVisible,
            projects,
            fetchProjects,
          }}
        />

        {/* General Infos */}
        <InfoTable {...{ generalInfo, projectTypes }} />

        {/* Filter Section */}
        <FilterTable {...{ filters, setFilters, managers }} />

        {/* Search Section */}
        <SearchForm
          {...{
            addModelVisible,
            editModelVisible,
            setAddModelVisible,
            setEditModelVisible,
            deleteModelVisible,
            setDeleteModelVisible,
            search,
            setSearch,
            fetchProjects,
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
    </div>
  );
}
