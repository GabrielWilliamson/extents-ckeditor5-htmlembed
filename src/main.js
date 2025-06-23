import {
  ClassicEditor,
  Bold,
  Essentials,
  FullPage,
  HtmlEmbed,
  Italic,
  Paragraph,
  SourceEditing,
  Plugin,
  ButtonView,
  IconObjectInlineLeft,
  IconObjectInlineRight,
  IconObjectCenter,
  IconObjectFullWidth,
} from "ckeditor5";
import { initialData } from "./initial-data";
import "ckeditor5/ckeditor5.css";

export default class IframeAligner extends Plugin {
  init() {
    const editor = this.editor;

    const alignments = [
      {
        name: "alignLeft",
        label: "Align Html Left",
        class: "align-left",
        icon: IconObjectInlineLeft,
      },
      {
        name: "alignCenter",
        label: "Align Html Center",
        class: "align-center",
        icon: IconObjectCenter,
      },
      {
        name: "alignRight",
        label: "Align Html Right",
        class: "align-right",
        icon: IconObjectInlineRight,
      },
      {
        name: "fullWidth",
        label: "Full Width",
        class: "embed-container-full",
        icon: IconObjectFullWidth,
      },
    ];

    alignments.forEach(({ name, label, class: className, icon }) => {
      editor.ui.componentFactory.add(name, (locale) => {
        const button = new ButtonView(locale);

        button.set({
          label,
          icon,
          withText: false,
          tooltip: true,
          isEnabled: false,
          isOn: false,
        });

        button.on("execute", () => this.setAlignment(className));

        editor.model.document.selection.on("change:range", () => {
          const selectedElement =
            editor.model.document.selection.getSelectedElement();
          const isRawHtml = selectedElement?.is("element", "rawHtml") ?? false;

          button.isEnabled = isRawHtml;

          if (isRawHtml) {
            const value = selectedElement.getAttribute("value") || "";
            button.isOn = value.includes(className);
          } else {
            button.isOn = false;
          }
        });

        return button;
      });
    });
  }

  setAlignment(className) {
    const editor = this.editor;
    const modelElement = editor.model.document.selection.getSelectedElement();

    if (!modelElement || !modelElement.is("element", "rawHtml")) {
      console.warn("No rawHtml widget selected");
      return;
    }

    const html = modelElement.getAttribute("value");
    if (!html) return;

    const wrapRegex = /^<div class="([^"]+)">([\s\S]*)<\/div>$/;
    const match = html.trim().match(wrapRegex);

    let classes = [];
    let innerContent = html;

    if (match) {
      classes = match[1].split(" ");
      innerContent = match[2];
    }

    if (classes.includes(className)) {
      classes = classes.filter((cls) => cls !== className);
    } else {
      classes.push(className);
    }

    let newHtml;
    if (classes.length > 0) {
      newHtml = `<div class="${classes.join(" ")}">${innerContent}</div>`;
    } else {
      newHtml = innerContent;
    }

    editor.model.change((writer) => {
      writer.setAttribute("value", newHtml, modelElement);
    });
  }
}

import "./style.css";

const LICENSE_KEY = "GPL";

const editorConfig = {
  toolbar: {
    items: [
      "sourceEditing",
      "|",
      "htmlEmbed",
      "|",
      "alignLeft",
      "alignCenter",
      "alignRight",
      "fullWidth",
    ],
    shouldNotGroupWhenFull: false,
  },
  plugins: [
    Bold,
    Essentials,
    FullPage,
    Italic,
    Paragraph,
    SourceEditing,
    HtmlEmbed,
    IframeAligner,
  ],
  htmlSupport: {
    allow: [
      {
        name: /^.*$/,
        styles: true,
        attributes: true,
        classes: true,
      },
    ],
  },

  initialData: initialData,
  licenseKey: LICENSE_KEY,
  placeholder: "Type or paste your content here!",
};

ClassicEditor.create(document.querySelector("#editor"), editorConfig).then(
  (editor) => {
    const data = editor.getData();
    document.querySelector("#preview-content").innerHTML = data;

    editor.model.document.on("change", () => {
      const data = editor.getData();
      document.querySelector("#preview-content").innerHTML = data;
    });
  }
);
