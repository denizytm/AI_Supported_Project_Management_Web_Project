"use client";

import { RootState } from "@/redux/store";
import { ProjectType } from "@/types/projectType";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
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

  const [upcomingDeadlines, setUpcomingDeadlines] = useState<ProjectType[]>([]);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [projectTableDatas, setProjectTableDatas] = useState<
    {
      project: string;
      spent: number;
    }[]
  >([]);

  const currentUser = useSelector((state: RootState) => state.currentUser.user);

  const router = useRouter();

  useEffect(() => {
    if (currentUser && currentUser.roleName == "Client") router.push("/client");
  }, [currentUser]);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get(
          "http://localhost:5110/api/projects/dashboard/get-all"
        );
        if (response.status) {
          setGeneralInfo(response.data.generalInfos);
          setProjectTypes(response.data.projectTypes);
          setProjects(response.data.projectDtos);
        }
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (projects.length) {
      setProjectTableDatas(
        projects.map((p) => {
          return {
            project: p.name,
            spent: p.spentBudget,
          };
        })
      );
      setUpcomingDeadlines(
        [...projects]
          .sort(
            (a, b) =>
              new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          )
          .slice(0, 3)
      );
    }
  }, [projects]);

  if (!projects.length && !projectTableDatas.length) return <>Loading...</>;
  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-900 min-h-screen">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Projects
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {generalInfo.projectCount}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Expense
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            $
            {projects
              .reduce((prev, current) => {
                return prev + current.spentBudget;
              }, 0)
              .toFixed(2)}
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Acitve Users
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            14
          </h2>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Projects On Risk
          </p>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
            {projects.reduce((prev, current) => {
              if (current.priorityName == "High") return prev + 1;
              else return prev;
            }, 0)}
          </h2>
        </div>
      </div>

      {/* Bütçe Bar Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Project Budget Distribution
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={projectTableDatas}>
            <XAxis dataKey="project" stroke="#ccc" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="spent" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Yaklaşan Teslimatlar */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-6">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Incoming Deadlines
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          {upcomingDeadlines.map((project) => (
            <li key={project.id}>
              🔔 {project.name} –{" "}
              {new Date(project.deadline).toLocaleDateString("tr-TR")}
            </li>
          ))}
        </ul>
      </div>

      {/* Son Etkinlikler */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Last Activities
        </h3>
        <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
          <li>📝 New task assigned - 06.05.2025</li>
          <li>📦 Project Z completed - 05.05.2025</li>
          <li>📨 New message - 04.05.2025</li>
        </ul>
      </div>
    </div>
  );
}
