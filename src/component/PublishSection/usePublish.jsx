import React, { useState, useEffect } from "react";
import axios from "axios";
//this is a custom hook
function usePublish(type) {
  //get writer info
  const { username } = JSON.parse(localStorage.getItem("token"))[0];
  //data for table
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    axios
      .get(`/news?author=${username}&publishState=${type}&_expand=category`)
      .then(
        (response) => {
          setDataSource(response.data);
        },
        (err) => console.log(err.message)
      );
  }, [username]);
  return dataSource;
}

export default usePublish;
