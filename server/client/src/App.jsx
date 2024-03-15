import React from "react";
import Editor from "./components/Editor";
import { Navigate, createBrowserRouter } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const App = () => {
  return (
    <div>
      <Editor />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/docs/:id",
    element: <App />,
  },
  {
    path: "/",
    element: <Navigate replace to={`/docs/${uuidv4()}`} />,
  },
]);

export default router;
