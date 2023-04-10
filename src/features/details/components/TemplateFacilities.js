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
import TriColumn from "../../../components/TriColumn";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";
import { FaCheckCircle } from "react-icons/fa";

function Component({
  thumbnail,
  images = [{}],
  title,
  website,
  phone,
  merchant,
  transparent = false,
  email,
  labels,
  contents,
  activeTab,
  pagetitle = "",
  imageTitle = "",
  loading = true,
}) {
  const [imgLoading, setImgLoading] = useState(true);

  return (
    <>
      <Breadcrumb2 title={title ? title : "Details"} />
      <h2 className="PageTitle">{pagetitle}</h2>
      <Loading loading={loading}>
        <Column style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flex: 1,
              overflow: "hidden",
            }}
          >
            <Row
              style={{
                maxWidth: 360,
                maxHeight: 170,
                borderRadius: 10,
              }}
            >
              <Column style={{ flex: "6", display: "block" }}>
                <Card
                  style={{
                    marginLeft: "20px",
                    marginBottom: "20px",
                    borderRadius: 10,
                    border: 0,
                  }}
                >
                  <CardBody style={{ fontSize: 12 }}>
                    {imgLoading && (
                      <div
                        style={{
                          maxHeight: 300,
                          objectFit: "cover",
                          width: "100%",
                          marginBottom: 16,
                        }}
                        className="shine"
                      />
                    )}
                    <img
                      alt="Avatar"
                      src={
                        thumbnail && thumbnail !== "placeholder"
                          ? thumbnail
                          : require("../../../assets/fallback.jpg")
                      }
                      style={{
                        maxHeight: imgLoading ? 0 : 300,
                        objectFit: "cover",
                        width: "100%",
                        marginBottom: 16,
                        borderRadius: 6,
                      }}
                      onLoad={() => setImgLoading(false)}
                      onError={() => setImgLoading(false)}
                    />
                    <TriColumn
                      first={
                        <div>
                          {imgLoading && (
                            <div
                              style={{
                                maxHeight: 100,
                                objectFit: "cover",
                                width: 100,
                              }}
                              className="shine"
                            />
                          )}
                          <img
                            alt="Avatar"
                            src={
                              images[0] !== undefined
                                ? images[0].url
                                : require("../../../assets/fallback.jpg")
                            }
                            style={{
                              maxHeight: imgLoading ? 0 : 100,
                              objectFit: "cover",
                              width: 100,

                              borderRadius: 6,
                            }}
                            onLoad={() => setImgLoading(false)}
                            onError={() => setImgLoading(false)}
                          />
                        </div>
                      }
                      second={
                        <div>
                          {imgLoading && (
                            <div
                              style={{
                                maxHeight: 100,
                                objectFit: "cover",
                                width: 100,
                              }}
                              className="shine"
                            />
                          )}
                          <img
                            alt="Avatar"
                            src={
                              images[1] !== undefined
                                ? images[1].url
                                : require("../../../assets/fallback.jpg")
                            }
                            style={{
                              maxHeight: imgLoading ? 0 : 100,
                              objectFit: "cover",
                              width: 100,

                              borderRadius: 6,
                            }}
                            onLoad={() => setImgLoading(false)}
                            onError={() => setImgLoading(false)}
                          />
                        </div>
                      }
                      third={
                        <div>
                          {imgLoading && (
                            <div
                              style={{
                                maxHeight: 100,
                                objectFit: "cover",
                                width: 100,
                              }}
                              className="shine"
                            />
                          )}
                          <img
                            alt="Avatar"
                            src={
                              images[2] !== undefined
                                ? images[2].url
                                : require("../../../assets/fallback.jpg")
                            }
                            style={{
                              maxHeight: imgLoading ? 0 : 100,
                              objectFit: "cover",
                              width: 100,

                              borderRadius: 6,
                            }}
                            onLoad={() => setImgLoading(false)}
                            onError={() => setImgLoading(false)}
                          />
                        </div>
                      }
                    />
                  </CardBody>
                </Card>
              </Column>
            </Row>
            <div
              className={
                transparent ? "Container-transparent" : "Container-dashboard-ns"
              }
              style={{
                flex: 1,
                width: "100%",
                overflow: "auto",
                borderRadius: 10,
              }}
            >
              <Tab labels={labels} contents={contents} activeTab={activeTab} />
            </div>
          </div>
        </Column>
      </Loading>
    </>
  );
}

export default Component;
