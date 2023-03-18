import React from "react";
import { Button } from "antd";
import usePublish from "../../../component/PublishSection/usePublish";
import PublishSection from "../../../component/PublishSection";
export default function Published() {
  const dataSource = usePublish(2);
  const publishedNews = (item) => {
    console.log(item);
  };
  const ButtonTo = (id) => {
    return (
      <Button danger onClick={() => publishedNews(id)}>
        下线
      </Button>
    );
  };
  return (
    <PublishSection
      dataSource={dataSource}
      button={(id) => ButtonTo(id)}
    ></PublishSection>
  );
}
