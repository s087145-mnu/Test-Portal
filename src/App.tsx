// @ts-nocheck
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Admin from './Admin';
import Explorer from './Explorer';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Explorer />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}