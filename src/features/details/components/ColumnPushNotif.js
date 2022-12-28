import React, { useState } from "react";

import Row from "../../../components/Row";
import Column from "../../../components/Column";
import { Card, CardBody, CardHeader, CardTitle } from "reactstrap";

function Component({
  image,
  link,
  transparent = false,
  contents,
  onLoad,
  onError,
  imgLoading,
}) {
  return (
    <>
      <Column style={{ width: "100%" }}>
        <div
          style={{
            display: "flex",
            flex: 1,
            overflow: "hidden",
          }}
        >
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
            {contents}
          </div>
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
                <CardHeader style={{ background: "transparent" }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>
                    Attachment
                  </span>
                </CardHeader>
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
                    data-testid="image-output"
                    alt="Avatar"
                    src={
                      image && image !== "placeholder"
                        ? image
                        : require("../../../assets/default_img.jpg")
                    }
                    style={{
                      maxHeight: imgLoading ? 0 : 300,
                      objectFit: "cover",
                      width: "100%",
                      marginBottom: 16,
                      borderRadius: 6,
                    }}
                    onLoad={onLoad}
                    onError={onError}
                  />
                  <div
                    style={{
                      marginBottom: 4,
                      fontSize: "16px",
                      fontWeight: 700,
                    }}
                  >
                    Deep Link or Web Link
                  </div>
                  <div className="row">
                    <div
                      data-testid="link-avail"
                      className="col d-flex"
                      style={{ fontSize: "14px", fontWeight: 400 }}
                    >
                      {link ? (
                        <a href={link} target="_blank">
                          {link}
                        </a>
                      ) : (
                        "Not Available"
                      )}
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Column>
          </Row>
        </div>
      </Column>
    </>
  );
}

export default Component;
