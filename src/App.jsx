import React, { useEffect, useState } from "react";
import { Row, Col, InputNumber } from "antd";

// ass this app has very little number of components, thats why all are placed in single app file

// inner child component
const PkgComp = ({ name, price, qty }) => {
  return (
    <Col
      span={5}
      style={{ borderRight: "1px solid black", marginLeft: "10px" }}
    >
      <Row>
        <h3>{name}</h3>
      </Row>
      <Row>
        <Col span={12}>
          <h4>{name ? "Qty" : null}</h4>
          <h4>
            <i>{qty}</i>
          </h4>
        </Col>
        <Col span={12}>
          <h4>{name ? "Price" : null}</h4>
          <h4>
            <i>{price}</i>
          </h4>
        </Col>
      </Row>
    </Col>
  );
};

// parent component
const Master = ({ list }) => {
  const [req, setReq] = useState({
    bottles: 0,
    packs: 0,
    Box: 0,
    price: 0,
  });

  return (
    <div style={{ marginBottom: "40px" }}>
      <Row>
        <Col span={7}>
          <h3>Enter Required Quantity: </h3>
        </Col>
        <Col>
          <InputNumber
            min={0}
            onChange={(e) => {
              console.log("here");
              var myHeaders = new Headers();
              myHeaders.append("Content-Type", "application/json");

              var raw = JSON.stringify({
                requiredBottles: e,
                prices: [list.piece?.price, list.pack?.price, list.box?.price],
                pieces: [
                  list.piece?.quantity,
                  list.pack?.quantity,
                  list.box?.quantity,
                ],
              });

              console.log(raw);

              var requestOptions = {
                method: "POST",
                headers: myHeaders,
                body: raw,
                redirect: "follow",
              };

              fetch("https://ps-assign-backend.herokuapp.com/", requestOptions)
                .then((response) => response.json())
                .then((result) => {
                  console.log(result);
                  setReq(result);
                })
                .catch((error) => console.log("error", error));
            }}
          />
        </Col>
      </Row>

      <Row
        style={{
          minHeight: "120px",
          width: "100%",
          border: "1px solid",
          margin: "10px",
          padding: "10px",
        }}
      >
        <PkgComp
          name={list.box?.name}
          qty={list.box?.quantity}
          price={list.box?.price}
        />
        <PkgComp
          name={list.pack?.name}
          qty={list.pack?.quantity}
          price={list.pack?.price}
        />
        <PkgComp
          name={list.piece?.name}
          qty={list.piece?.quantity}
          price={list.piece?.price}
        />

        <Col span={6} style={{ marginLeft: "10px" }}>
          <Row>
            <Col span={12}>
              <h3>Total Price:</h3>
            </Col>
            <Col span={12}>
              <h3>{req.price}</h3>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <h4>{list.box?.name}</h4>
            </Col>
            <Col span={6}>
              <h4>{req.Box > 0 ? req.Box : null}</h4>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <h4>{list.pack?.name}</h4>
            </Col>
            <Col span={6}>
              <h4>{req.packs > 0 ? req.packs : null}</h4>
            </Col>
          </Row>
          <Row>
            <Col span={18}>
              <h4>{list.piece?.name}</h4>
            </Col>
            <Col span={6}>
              <h4>{req.bottles > 0 ? req.bottles : null}</h4>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

// main app component
export default function App(props) {
  const [priceList, setPriceList] = useState([]);

  useEffect(() => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    fetch("https://ps-assign-backend.herokuapp.com/data", requestOptions)
      .then((response) => response.json())
      .then(({ pricelist }) => setPriceList(pricelist))
      .catch((error) => console.log("error", error));
  }, []);

  useEffect(() => console.log(priceList), [priceList]);

  return (
    <div
      style={{
        border: "1px solid black",
        minHeight: "80vh",
        maxWidth: "800px",
        margin: "auto",
        marginTop: "20px",
        padding: "20px",
      }}
    >
      {priceList.map((list) => (
        <Master list={list} />
      ))}
    </div>
  );
}
