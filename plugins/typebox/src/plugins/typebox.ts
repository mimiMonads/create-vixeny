import * as Avj from "@feathersjs/schema";
import * as TypeBox from "@sinclair/typebox";
import * as Vixney from "vixeny";
import { typeBox } from "vixeny-plugins";

const {
  Type,
} = TypeBox;

const parser = typeBox.composedBox(Vixney)(Avj)(TypeBox);
const bodyParser = parser({
  key: {
    scheme: {
      id: Type.Number(),
      text: Type.String(),
      createdAt: Type.Number(),
      userId: Type.Number(),
    },
    options: { $id: "Message", additionalProperties: false },
  },
});

export default  {
  typebox: bodyParser,
};
