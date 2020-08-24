import first from "@ckeditor/ckeditor5-utils/src/first";

export function modelToViewStyleAttribute(styles) {
  return (evt, data, conversionApi) => {
    if (!conversionApi.consumable.consume(data.item, evt.name)) {
      return;
    }

    const newStyle = getStyleByName(data.attributeNewValue, styles);
    const oldStyle = getStyleByName(data.attributeOldValue, styles);

    const viewElement = conversionApi.mapper.toViewElement(data.item);
    const viewWriter = conversionApi.writer;

    if (oldStyle) {
      viewWriter.removeClass(oldStyle.className, viewElement);
    }

    if (newStyle) {
      viewWriter.addClass(newStyle.className, viewElement);
    }
  };
}

export function viewToModelStyleAttribute(styles) {
  const filteredStyles = styles.filter((style) => !style.isDefault);

  return (evt, data, conversionApi) => {
    if (!data.modelRange) {
      return;
    }

    const viewFigureElement = data.viewItem;
    const modelMediaElement = first(data.modelRange.getItems());

    if (!conversionApi.schema.checkAttribute(modelMediaElement, "mediastyle")) {
      return;
    }

    for (const style of filteredStyles) {
      if (
        conversionApi.consumable.consume(viewFigureElement, {
          classes: style.className,
        })
      ) {
        conversionApi.writer.setAttribute(
          "mediastyle",
          style.name,
          modelMediaElement
        );
      }
    }
  };
}

function getStyleByName(name, styles) {
  for (const style of styles) {
    if (style.name === name) {
      return style;
    }
  }
}
