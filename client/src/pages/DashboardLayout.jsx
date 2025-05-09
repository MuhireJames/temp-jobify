import {
  Outlet,
  redirect,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "react-router-dom";
import { createContext, useState } from "react";
import Wrapper from "../assets/wrappers/Dashboard";
import { BigSidebar, NavBar, SmallSidebar, Loading } from "../components";
import { useContext, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

import customFetch from "../utils/customFetch";

import { toast } from "react-toastify";

const userQuery = {
  queryKey: ["user"],
  queryFn: async () => {
    const { data } = await customFetch.get("/users/current-user");
    return data;
  },
};
export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect("/");
  }
};
const DashboardContext = createContext();

function DashboardLayout({ isDarkThemeEnabled, queryClient }) {
  const { user } = useQuery(userQuery)?.data;

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === "loading";

  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);
  const [isAuthError, setIsAuthError] = useState(false);

  function toggleDarkTheme() {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle("dark-theme", newDarkTheme);
    localStorage.setItem("darkTheme", newDarkTheme);
  }
  function toggleSidebar() {
    setShowSidebar(!showSidebar);
  }
  async function logoutUser() {
    navigate("/");
    await customFetch.get("/auth/logout");
    queryClient.invalidateQueries();
    toast.success("logging out...");
  }
  customFetch.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        setIsAuthError(true);
      }
      return Promise.reject(error);
    }
  );
  useEffect(() => {
    if (!isAuthError) return;
    logoutUser();
  }, [isAuthError]);
  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <NavBar />
            <div className="dashboard-page">
              {isPageLoading ? <Loading /> : <Outlet context={{ user }} />}
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
}
export const useDashboardContext = () => useContext(DashboardContext);

export default DashboardLayout;
