import * as TypeBox from "@sinclair/typebox";
import { plugins } from "vixeny";
import { TypeCompiler } from "@sinclair/typebox/compiler";
import { typeBox } from "vixeny-plugins";

const {
  Type,
} = TypeBox;

const parser = typeBox.composedBox({
  plugins,
  TypeCompiler,
  TypeBox,
});
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

export default {
  typebox: bodyParser,
};
