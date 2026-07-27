"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

import {
  ProjectState,
  initialProjectState,
} from "./ProjectStore";

type ContextType = {
  project: ProjectState;
  setProject: React.Dispatch<
    React.SetStateAction<ProjectState>
  >;
};

const ProjectContext =
  createContext<ContextType | null>(null);

export function ProjectProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [project, setProject] =
    useState(initialProjectState);

  return (
    <ProjectContext.Provider
      value={{ project, setProject }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const context = useContext(ProjectContext);

  if (!context) {
    throw new Error(
      "useProject must be used inside ProjectProvider"
    );
  }

  return context;
}