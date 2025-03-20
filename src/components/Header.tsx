import Head from "next/head";
import React from "react";

const Header = ({ title, desc }: { title: string; desc?: string }) => {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={desc ?? "Project Management App"} />
      <link rel="icon" href="/favicon.ico" />
    </Head>
  );
};

export default Header;
