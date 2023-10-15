import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import CustomAlert from "../../components/CustomAlert";
import "react-confirm-alert/src/react-confirm-alert.css";

import Modal from "../../components/Modal";

import Input from "../../components/Input";
import Button from "../../components/Button";
import {
  getTransactionList,
  refresh,
  stopAsync,
} from "../slices/billing";
import {
  inputDateTimeFormatterYmd
} from "../../utils";
import { get, post, setInfo } from "../slice";

import Template from "./components/Template";

const columnTransaction = [
  { Header: 'Category', accessor: `category_id` },
  { Header: 'Regis', accessor: 'regis' },
  { Header: 'Regis DP', accessor: 'regis_dp' },
  { Header: 'AP', accessor: 'active_player' },
  { Header: 'Trans DP', accessor: 'trans_dp' },
  { Header: 'Trans WD', accessor: 'trans_wd' },
  { Header: 'Total DP', accessor: 'total_dp' },
  { Header: 'Total WD', accessor: 'total_wd' },
  { Header: 'WL', accessor: 'wl' },
  { Header: 'Conv DP', accessor: 'conv_dp' },
  { Header: 'Conv TR', accessor: 'conv_tr' },
  { Header: 'SubTotal', accessor: 'sub_total' },
  { Header: 'ATS', accessor: 'ats' },
  { Header: 'Total', accessor: 'total' },
  { Header: 'Trans Date', accessor: 'trans_date' }
];

function Component({ view }) {
  const [search, setSearch] = useState("");

  const { role } = useSelector((state) => state.auth);

  const [modalPublish, toggleModalPublish] = useState(false);
  const handleShow = () => toggleModalPublish(true);

  const [categoryList, setCategoryList] = useState();
  const [alert, setAlert] = useState("");

  const [category, setCategory] = useState();
  const [regis, setRegis] = useState();
  const [regisDP, setRegisDP] = useState();
  const [activePlayer, setActivePlayer] = useState();
  const [transDP, setTransDP] = useState();
  const [transWD, setTransWD] = useState();
  const [totalDP, setTotalDP] = useState();
  const [totalWD, setTotalWD] = useState();
  const [wl, setWL] = useState();
  const [transDate, setTransDate] = useState();



  let dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      get(
        "http://86.38.203.90:1111/category" +
          "?limit=10" +
          "&page=1" +
          "&search=" +
          search,
        (res) => {
          console.log(res.data.data);
          let formatted = res.data.data.map((el) => ({ label: el.name, value: el.id }));
          setCategoryList(formatted);
        }
      )
    );
  }, [dispatch,search]);

  return (
    <>
      <Modal
        isOpen={modalPublish}
        toggle={() => {
          toggleModalPublish(false);
        }}
        title="Add Transaction"
        okLabel={"Submit"}
        onClick={() => {
          dispatch(
            post(
              "http://86.38.203.90:1111/transaction",
              {
                category_id: parseInt(category),
                regis: parseInt(regis),
                regis_dp: parseInt(regisDP),
                active_player: parseInt(activePlayer),
                trans_dp : parseInt(transDP),
                trans_wd : parseInt(transWD),
                total_dp : parseInt(totalDP),
                total_wd : parseInt(totalWD),
                wl:parseInt(wl),
                trans_date: inputDateTimeFormatterYmd(transDate),
              },
              (res) => {
                dispatch(
                  setInfo({
                    color: "success",
                    message: `${res.data.data} billing has been set to released.`,
                  })
                );
                getTransactionList();
                // resultComponent ? setOpenRes(true) : toggle();
              },
              (err) => {
                dispatch(
                  setInfo({
                    color: "error",
                    message: `Error to released.`,
                  })
                );
                console.log("error");
              }
            )
          );

          dispatch(refresh());
          dispatch(stopAsync());
          toggleModalPublish(false);
        }}
      >
        <Input
          label="Category"
          inputValue={category}
          type="select"
          options={categoryList}
          setInputValue={setCategory}
          title="Category"
          hidden={role !== "sa"}
        />

        <Input
          label="regis"
          inputValue={regis}
          type="number"
          setInputValue={setRegis}
          title="Regis"
        />

        <Input
          label="regis_dp"
          inputValue={regisDP}
          type="number"
          setInputValue={setRegisDP}
          title="Regis DP"
        />

        <Input
          label="active_player"
          inputValue={activePlayer}
          type="number"
          setInputValue={setActivePlayer}
          title="Active Player"
        />

        <Input
          label="trans_dp"
          inputValue={transDP}
          type="number"
          setInputValue={setTransDP}
          title="Trans DP"
        />

        <Input
          label="trans_wd"
          inputValue={transWD}
          type="number"
          setInputValue={setTransWD}
          title="Trans WD"
        />

        <Input
          label="total_dp"
          inputValue={totalDP}
          type="number"
          setInputValue={setTotalDP}
          title="Total DP"
        />

        <Input
          label="total_wd"
          inputValue={totalWD}
          type="number"
          setInputValue={setTotalWD}
          title="Total WD"
        />

        <Input
          label="wl"
          inputValue={wl}
          type="number"
          setInputValue={setWL}
          title="WL"
        />
        
        <Input
          type="datetime-local"
          label="Trans Date"
          name="trans_date"
          inputValue={transDate}
          setInputValue={setTransDate}
        />
      </Modal>

      <CustomAlert
        isOpen={alert}
        toggle={() => setAlert(false)}
        title={"Error"}
        subtitle={"Please Choose Building"}
        content={"You need to choose Building first"}
      />

      <Template
        view={view}
        title="Unit"
        pagetitle="Transaction List"
        columns={columnTransaction}
        slice="billing"
        getAction={getTransactionList}
        renderActions={
          view
            ? null
            : (selectedRowIds, page) => {
                return [
                  <Button label="Add Transaction" onClick={handleShow} />,
                ];
              }
        }
      />
    </>
  );
}
export default Component;
