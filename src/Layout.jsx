import React, { useEffect, useState } from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Sidebar from "./components/layouts/Sidebar";
import Header from "./components/layouts/Header";
import MainContent from "./components/layouts/MainContent";

const Layout = ({ pageTitle, children }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        {/* title tag */}
        {pageTitle ? (
          <title>{pageTitle}</title>
        ) : (
          <title>BigTrCoin Presale</title>
        )}

        {/* favicon included here  */}
        <link rel="shortcut icon" href="/favicon.svg" type="image/x-icon" />
        {/* apple touch icon included here */}
        <link rel="apple-touch-icon" href="/favicon.svg" />
      </Helmet>

      <div className="relative">
        {/* sidebar */}
        <Sidebar scrolled={scrolled} />

        {/* header  */}
        <Header scrolled={scrolled} />

        {/* main content */}
        <MainContent>
          {/* page content */}
          {children}
        </MainContent>
      </div>
    </HelmetProvider>
  );
};

export default Layout;
