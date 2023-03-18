import React from "react";
import { Button } from "antd";
import usePublish from "../../../component/PublishSection/usePublish";
import PublishSection from "../../../component/PublishSection";
export default function NotPublishYet() {
  const dataSource = usePublish(1);
  const publishNews = (item) => {
    console.log(item);
  };
  const ButtonTo = (id) => {
    return (
      <Button type="primary" onClick={() => publishNews(id)}>
        发布
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
