import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Quill } from "react-quill";
import { FaRedo, FaUndo, FaRegWindowMinimize } from "react-icons/fa";
import "./quil-snow.css";
import "./quill-custom.css"; // Custom CSS for additional styles

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const UndoButton = () => <FaUndo />;
const RedoButton = () => <FaRedo />;
const DividerButton = () => <FaRegWindowMinimize />;

// Quill Blot for Divider
const BlockEmbed = Quill.import("blots/block/embed");

class DividerBlot extends BlockEmbed {}

DividerBlot.blotName = "divider";
DividerBlot.tagName = "hr";
Quill.register(DividerBlot);

// Undo and Redo handlers
function undoChange() {
  this.quill.history.undo();
}

function redoChange() {
  this.quill.history.redo();
}

// Custom handlers for adding a divider and borders
function addDivider() {
  const range = this.quill.getSelection(true);
  this.quill.insertText(range.index, "\n", Quill.sources.USER);
  this.quill.insertEmbed(range.index + 1, "divider", true, Quill.sources.USER);
  this.quill.setSelection(range.index + 2, Quill.sources.SILENT);
}

function addBorderToContent() {
  const editor = this.quill;
  const editorElement = editor.root;
  if (editorElement.classList.contains("bordered-content")) {
    editorElement.classList.remove("bordered-content");
  } else {
    editorElement.classList.add("bordered-content");
  }
}

function addBorderToSelectedText() {
  const range = this.quill.getSelection();
  if (range) {
    const format = this.quill.getFormat(range);
    if (format.bordered) {
      this.quill.format("bordered", false);
    } else {
      this.quill.format("bordered", true);
    }
  }
}

// Register a custom format for bordered text
const Inline = Quill.import("blots/inline");

class BorderBlot extends Inline {}

BorderBlot.blotName = "bordered";
BorderBlot.tagName = "span";
BorderBlot.className = "bordered-text";
Quill.register(BorderBlot);

const modules = {
  toolbar: {
    container: "#toolbar",
    handlers: {
      undo: undoChange,
      redo: redoChange,
      divide: addDivider,
      borderContent: (value) => {
        console.log(value);
        addBorderToContent();
      },
      borderSelected: addBorderToSelectedText,
    },
  },
  history: {
    delay: 500,
    maxStack: 100,
    userOnly: true,
  },
};

const formats = [
  "header",
  "font",
  "size",
  "bold",
  "italic",
  "underline",
  "align",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "direction",
  "divider",
  "bordered",
];

const QuillToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
      <select className="ql-header" defaultValue="6">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
        <option value="">Normal</option>
      </select>
    </span>
    <span className="ql-formats">
      <button className="ql-bold" />
      <button className="ql-italic" />
      <button className="ql-underline" />
      <button className="ql-strike" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
    </span>
    <span className="ql-formats">
      <button className="ql-blockquote" />
    </span>
    <span className="ql-formats">
      <button className="ql-list" value="ordered" />
      <button className="ql-list" value="bullet" />
      <button className="ql-indent" value="-1" />
      <button className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button className="ql-divide">
        <DividerButton />
      </button>
      <button className="ql-border-content">Border Content</button>
      <button className="ql-border-selected">Border Selected</button>
    </span>
    <span className="ql-formats">
      <button className="ql-undo">
        <UndoButton />
      </button>
      <button className="ql-redo">
        <RedoButton />
      </button>
    </span>
  </div>
);

export const WordComponent = ({
  description,
  setDescription,
  index,
  setNewPage,
}) => {
  const quillRef = useRef(null);
  const editorContainerRef = useRef(null);
  const [pageContent, setPageContent] = useState(
    description[index]?.content || "",
  );

  const handleChange = (content, delta, source, editor) => {
    setPageContent(content);
    const descriptionCopy = [...description];
    descriptionCopy[index].content = content;
    setDescription(descriptionCopy);
  };

  const handleMaxHeight = (e) => {
    const currentHeight =
      editorContainerRef.current.querySelector(".ql-editor").offsetHeight;
    if (currentHeight >= 842) {
      if (e.code === "Enter" || e.code === "NumpadEnter") {
        e.preventDefault();
        if (index < description.length - 1) {
          return;
        }
        const editDescription = description.map((item, i) => {
          if (i === index) {
            return { ...item, content: pageContent };
          }
          return item;
        });
        setDescription([...editDescription]);
        setNewPage(true);
      }
    }
  };

  return (
    <div
      ref={editorContainerRef}
      key={index}
      onKeyDownCapture={(e) => {
        handleMaxHeight(e);
      }}
      className="page"
    >
      <QuillToolbar />
      <ReactQuill
        ref={quillRef}
        theme="snow"
        modules={modules}
        formats={formats}
        value={pageContent}
        onChange={handleChange}
        className="custom-quill-editor w-fit mx-auto"
        style={{
          direction: "rtl",
          maxHeight: "842px",
          overflow: "hidden",
        }}
        defaultValue={{ direction: "rtl" }}
        placeholder="Compose here"
      />
    </div>
  );
};
