import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import MediaStyleCommand from "./mediaembedcommand";
import {
  viewToModelStyleAttribute,
  modelToViewStyleAttribute,
} from "./converters";
import { normalizeMediaStyles } from "./utils";

export default class MediaStyleEditing extends Plugin {
  static get pluginName() {
    return "MediaStyleEditing";
  }

  init() {
    const editor = this.editor;
    const schema = editor.model.schema;
    const data = editor.data;
    const editing = editor.editing;

    editor.config.define("mediaEmbed.styles", ["full", "side"]);

    const styles = normalizeMediaStyles(editor.config.get("mediaEmbed.styles"));

    schema.extend("media", { allowAttributes: "mediastyle" });

    const modelToViewConverter = modelToViewStyleAttribute(styles);
    editing.downcastDispatcher.on(
      "attribute:mediastyle:media",
      modelToViewConverter
    );
    data.downcastDispatcher.on(
      "attribute:mediastyle:media",
      modelToViewConverter
    );

    data.upcastDispatcher.on(
      "element:figure",
      viewToModelStyleAttribute(styles),
      { priority: "low" }
    );

    editor.commands.add("mediastyle", new MediaStyleCommand(editor, styles));
  }
}
