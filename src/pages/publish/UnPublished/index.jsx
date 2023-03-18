import React from "react";
import { Button } from "antd";
import usePublish from "../../../component/PublishSection/usePublish";
import PublishSection from "../../../component/PublishSection";
export default function UnPublished() {
  const dataSource = usePublish(3);
  const publishedNews = (item) => {
    console.log(item);
  };
  const ButtonTo = (id) => {
    return (
      <Button danger onClick={() => publishedNews(id)}>
        删除
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
