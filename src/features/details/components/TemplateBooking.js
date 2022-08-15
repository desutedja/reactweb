import React, { useState } from "react";
import { FiGlobe, FiPhone, FiMail, FiCheckCircle } from "react-icons/fi";
import {
  RiCheckboxLine,
  RiCheckLine,
  RiLightbulbLine,
  RiStore2Line,
} from "react-icons/ri";

import Loading from "../../../components/Loading";
import Tab from "../../../components/Tab";
import Breadcrumb2 from "../../../components/Breadcrumb2";
import Row from "../../../components/Row";
import Column from "../../../components/Column";
import TwoColumn from "../../../components/TwoColumn";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";
import ColumnBooking from "./ColumnBooking";

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
      <h2 data-testid="page-title" style={{ marginLeft: "16px" }}>{pagetitle}</h2>
      <Breadcrumb2 title={title ? title : "Details"} />
      <Loading loading={loading}>
        <ColumnBooking
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
