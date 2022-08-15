import React, { useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiSearch, FiDownload, FiUpload } from "react-icons/fi";

import Input from "../../components/Input";
import Filter from "../../components/Filter";
import Button from "../../components/Button";

import {
    getBuilding,
  setSelected,
} from "../slices/xenplatform";
import Building from '../../components/cells/XenPlatform';

import Template from "./components/Template";

const columns = [
    { Header: 'ID', accessor: 'id' },
    { Header: 'Name', accessor: row => <Building id={row.id} data={row} /> },
    { Header: 'Legal Name', accessor: 'legal_name' },
    { Header: 'External ID', accessor: 'external_id' },
    { Header: 'Fee VA', accessor: 'fee_va' },
    { Header: 'Fee eWallets', accessor: 'fee_ewallets' },
    { Header: 'Fee CC', accessor: 'fee_cc_amount' },
   
]

function Component({ view }) {
   
    const [search, setSearch] = useState("");

    const { role, user } = useSelector((state) => state.auth);
  
    const [building, setBuilding] = useState("");
    const [buildingName, setBuildingName] = useState("");
    
  
    const [limit, setLimit] = useState(5);
    const [upload, setUpload] = useState(false);
  
    let dispatch = useDispatch();
    let history = useHistory();
    let { url } = useRouteMatch();

    return (
        <>
     
        <Template
        pagetitle="Building List Active Xen Platform"
        title="Xen Platform"
        columns={columns}
        slice="xenplatform"
        getAction={getBuilding}
        filterVars={[building, upload]}
        
        actions={
          view
            
              
        }
        onClickAddBilling={
          view
           
        }
      />
        </>
    )
}

export default Component;
