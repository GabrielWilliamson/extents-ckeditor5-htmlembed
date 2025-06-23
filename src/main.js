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
} from "ckeditor5";

import "ckeditor5/ckeditor5.css";

export default class IframeAligner extends Plugin {
  init() {
    const editor = this.editor;

    this._isRawHtmlSelected = false;

    editor.model.document.selection.on("change:range", () => {
      const selectedElement =
        editor.model.document.selection.getSelectedElement();

      this._isRawHtmlSelected =
        selectedElement?.is("element", "rawHtml") ?? false;
    });

    const alignments = [
      { name: "alignLeft", label: "Left", class: "align-left" },
      { name: "alignCenter", label: "Center", class: "align-center" },
      { name: "alignRight", label: "Right", class: "align-right" },
    ];

    for (const { name, label, class: className } of alignments) {
      editor.ui.componentFactory.add(name, (locale) => {
        const button = new ButtonView(locale);

        button.set({
          label,
          withText: true,
          tooltip: true,
        });

        button.on("execute", () => this.setAlignment(className));
        return button;
      });
    }
  }

  setAlignment(className) {
    const editor = this.editor;
    const modelElement = editor.model.document.selection.getSelectedElement();

    if (!modelElement || !modelElement.is("element", "rawHtml")) {
      console.warn("No HtmlEmbed widget selected");
      return;
    }

    const html = modelElement.getAttribute("value");
    if (!html) return;

    let wrappedHtml;

    const wrapRegex =
      /^<div class="align-(left|center|right)">([\s\S]*)<\/div>$/;
    const match = html.trim().match(wrapRegex);

    if (match) {
      const innerContent = match[2];
      wrappedHtml = `<div class="${className}">${innerContent}</div>`;
    } else {
      wrappedHtml = `<div class="${className}">${html}</div>`;
    }

    editor.model.change((writer) => {
      writer.setAttribute("value", wrappedHtml, modelElement);
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

  initialData: "",
  licenseKey: LICENSE_KEY,
  placeholder: "Type or paste your content here!",
};

ClassicEditor.create(document.querySelector("#editor"), editorConfig).then(
  (editor) => {
    editor.model.document.on("change:data", () => {
      console.log("event");
      const data = editor.getData();
      document.querySelector("#preview-content").innerHTML = data;
    });
  }
);

// snipets
document.addEventListener("DOMContentLoaded", () => {
  const youtube = document.getElementById("youtube");

  youtube.addEventListener("click", () => {
    navigator.clipboard
      .writeText(
        `<iframe width="560" height="315" src="https://www.youtube.com/embed/_CL6n0FJZpk?si=3XSzvNWY-Z9Cj9gd" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>`
      )
      .then(() => {
        youtube.innerText = "YoutTube Copied";
      });
  });

  const twitter = document.getElementById("twitter");

  twitter.addEventListener("click", () => {
    navigator.clipboard
      .writeText(
        `<blockquote class="twitter-tweet"><p lang="da" dir="ltr">realDevModel <a href="https://t.co/foc8K8ltTa">https://t.co/foc8K8ltTa</a> <a href="https://t.co/XZT2Z77rJG">pic.twitter.com/XZT2Z77rJG</a></p>&mdash; Programmer Humor (@PR0GRAMMERHUM0R) <a href="https://twitter.com/PR0GRAMMERHUM0R/status/1936846674791469120?ref_src=twsrc%5Etfw">June 22, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>`
      )
      .then(() => {
        twitter.innerHTML = "Twitter Copied";
      });
  });
});
