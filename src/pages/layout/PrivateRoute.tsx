import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from '@/base_page/sidebar.tsx';
import Profile from '@/base_page/profile.tsx';
import Posts from '@/base_page/post.tsx';
import SearchPage from '@/base_page/search.tsx';
import FollowPage from '@/base_page/follows.tsx';
import ProfileDetail from '@/base_page/profile_detail';
import '@/main_page.css';
import DetailedPost from '@/base_page/post_detail';
const PrivateLayout: React.FC = () => {
  return (
    <div className="home-container">
      {/* Sidebar and Profile remain constant */}
      <Sidebar />
        <div className="dynamic-content">
            <Routes>
            <Route path="" element={<Posts />} />
            <Route path="search" element={<SearchPage />} />
            <Route path="follow" element={<FollowPage />} />
            <Route path="profile-detail" element={<ProfileDetail />} />
            <Route path="post-detail/:postId" element={<DetailedPost />} />
            </Routes>
        </div>
      <Profile />
    </div>
  );
};

export default PrivateLayout;
