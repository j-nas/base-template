import Navbar from "./Navbar";
import Footer from "../Footer";
import Sidebar from "./Sidebar";
import Login from "./Login";
import { api } from "../../utils/api";
import { ThemeProvider } from "next-themes";
import { themes } from "../../pages/_app";
import { SessionProvider, useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const session = useSession();

  const { data: business } = api.businessInfo.getActive.useQuery();
  const { data: services } = api.service.getActive.useQuery();
  const { data: about } = api.aboutUs.getCurrent.useQuery();

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (!business || !services || !about) return null;

  return (
    <>
      <Head>
        <title>{business.title} Page Administration</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="relative">
        <Navbar
          services={services}
          business={business}
          toggleSidebar={toggleSidebar}
        />
        <main className="relative flex h-screen w-screen auto-cols-min grid-flow-col pt-16">
          <Sidebar sidebarOpen={sidebarOpen} />
          <div
            onClick={() => setSidebarOpen(false)}
            className="h-full w-screen scrollbar-thin scrollbar-track-base-100 scrollbar-thumb-primary "
          >
            {session.data ? <Login /> : children}
          </div>
        </main>
      </div>
    </>
  );
}
