import React from "react";
import { useRouteMatch, Switch, Route } from "react-router-dom";

import List from "../../list/Booking";
import Add from "../../form/BookingFacility";
import Edit from "../../form/BookingFacility";
import Details from "../../details/Booking/BookingDetail";
import FacilityDetails from "../../details/Booking/FacilityDetail";

function Component() {
  let { path } = useRouteMatch();

  return (
    <Switch>
      <Route exact path={path}>
        <List />
      </Route>
      <Route path={`${path}/add`}>
        <Add />
      </Route>
      <Route path={`${path}/facilities/edit`}>
        <Edit />
      </Route>
      <Route path={`${path}/booking/:id`}>
        <Details />
      </Route>
      <Route path={`${path}/facilities/:id`}>
        <FacilityDetails />
      </Route>
    </Switch>
  );
}

export default Component;
