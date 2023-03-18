import "antd/dist/antd.css";
import { useRoutes } from "react-router-dom";
import router from "./route";
function App() {
  const element = useRoutes(router);
  return <div style={{ height: "100%" }}>{element}</div>;
}

export default App;
