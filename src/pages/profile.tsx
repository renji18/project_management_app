import Header from "@/components/Header";
import Layout from "@/components/Layout";
import React from "react";

const Profile = () => {
  return (
    <>
      <Header title="Profile" />
      <Layout>
        <div className="flex h-full flex-col items-center justify-center">
          <h1>Welcome, !</h1>
        </div>
      </Layout>
    </>
  );
};

export default Profile;
