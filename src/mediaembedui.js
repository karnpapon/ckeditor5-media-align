import Plugin from "@ckeditor/ckeditor5-core/src/plugin";
import ButtonView from "@ckeditor/ckeditor5-ui/src/button/buttonview";
import { normalizeMediaStyles } from "./utils";
import "../theme/mediaembedstyle.css";

export default class MediaStyleUI extends Plugin {
  static get pluginName() {
    return "MediaStyleUI";
  }

  localizedDefaultStylesTitles(locales) {
    const t = this.editor.t;
    return {
      "Full size media": (locales && locales.full) || t("Full size media"),
      "Side media": (locales && locales.side) || t("Side media"),
      "Left aligned media":
        (locales && locales.alignLeft) || t("Left aligned media"),
      "Centered media": (locales && locales.alignCenter) || t("Centered media"),
      "Right aligned media":
        (locales && locales.alignRight) || t("Right aligned media"),
    };
  }

  init() {
    const editor = this.editor;
    const configuredStyles = editor.config.get("mediaEmbed.styles");
    const configuredLocales = editor.config.get("mediaEmbed.locales");
    const translatedStyles = translateStyles(
      normalizeMediaStyles(configuredStyles),
      this.localizedDefaultStylesTitles(configuredLocales)
    );

    for (const style of translatedStyles) {
      this._createButton(style);
    }
  }

  _createButton(style) {
    const editor = this.editor;

    const componentName = `mediastyle:${style.name}`;
    editor.ui.componentFactory.add(componentName, (locale) => {
      const command = editor.commands.get("mediastyle");
      const view = new ButtonView(locale);

      view.set({
        label: style.title,
        icon: style.icon,
        tooltip: true,
        isToggleable: true,
      });

      view.bind("isEnabled").to(command, "isEnabled");
      view.bind("isOn").to(command, "value", (value) => value === style.name);

      this.listenTo(view, "execute", () => {
        editor.execute("mediastyle", { value: style.name });
        editor.editing.view.focus();
      });

      return view;
    });
  }
}

function translateStyles(styles, titles) {
  for (const style of styles) {
    if (titles[style.title]) {
      style.title = titles[style.title];
    }
  }

  return styles;
}
