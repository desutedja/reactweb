import React, { useState } from "react";

import Loading from "../../../components/Loading";
import Breadcrumb2 from "../../../components/Breadcrumb2";
import ColumnPushNotif from "./ColumnPushNotif";

function Component({
  image,
  title,
  link,
  contents,
  pagetitle = "",
  loading = true,
}) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <>
      <Breadcrumb2 title={title ? title : "Details"} />
      <h2 data-testid="page-title" className="PageTitle">
        {pagetitle}
      </h2>
      <Loading loading={loading}>
        <ColumnPushNotif
          image={image}
          link={link}
          contents={contents}
          imgLoading={imgLoading}
          onLoad={() => setImgLoading(false)}
          onError={() => setImgLoading(false)}
        />
      </Loading>
    </>
  );
}

export default Component;
