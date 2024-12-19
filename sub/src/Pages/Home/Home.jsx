import { Navigate } from "react-router-dom";

export default function Home() {
  return <Navigate to={`${process.env.PUBLIC_URL}/login`} />;
}
