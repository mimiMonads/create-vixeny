import { jsxStaticServer } from "vixeny-prespective";

import * as Dom from "react-dom/server";
import * as React from "react";

export default jsxStaticServer(Dom)(React)();
