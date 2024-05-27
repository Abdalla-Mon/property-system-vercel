import React, { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const TinyMCEEditor = ({ description, setDescription }) => {
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [api, setApi] = useState(null);

  const firstApi = "3wbwceq8t9db1z356t0bg2g9ii1qls53vr1m86lnnuyxh58t";
  const secondApi = "n3w0cw05ayt3w378c9wy0jaoy3dwap07n1x308vjtb6h5atr";
  const getCurrentHalfOfMonthMessage = async () => {
    const today = new Date();
    const dayOfMonth = today.getDate();

    if (dayOfMonth <= 15) {
      return firstApi;
    } else {
      return secondApi;
    }
    await setApi(api);
    setLoading(false);
  };
  useEffect(() => {
    getCurrentHalfOfMonthMessage();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div style={{ margin: "auto", width: "26.5cm" }}>
      <Editor
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={description}
        apiKey={api}
        init={{
          height: 500,
          directionality: "rtl", // Enforce RTL
          menubar: "file insert format",
          menu: {
            file: { title: "File", items: "print" },
            insert: { title: "Insert", items: "hr" },
            format: {
              title: "Format",
              items:
                "bold italic underline strikethrough superscript subscript | formats blockformats",
            },
          },
          plugins: [
            "autolink lists link charmap print preview anchor",
            "searchreplace visualblocks fullscreen",
            "media table paste code help wordcount",
          ],
          toolbar:
            "undo redo | formatselect | bold italic underline | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | addborder removeborder | help",
          setup: (editor) => {
            editor.ui.registry.addButton("addborder", {
              text: "Add Border",
              onAction: () => {
                const content = editor.getContent({ format: "html" });
                const borderedContent = `<div class="bordered-content">${content}</div>`;
                editor.setContent(borderedContent);
              },
            });

            editor.ui.registry.addButton("removeborder", {
              text: "Remove Border",
              onAction: () => {
                const content = editor.getContent({ format: "html" });
                const noBorderContent = content.replace(
                  /<div class="bordered-content">|<\/div>/g,
                  "",
                );
                editor.setContent(noBorderContent);
              },
            });
          },
          content_style: `
            .bordered-content { border: 2px solid black; padding: 0; }
            body { direction: rtl; text-align: right; width: 25.5cm; }
            p, div, h1, h2, h3, h4, h5, h6, span { direction: rtl; text-align: right; }
          `,
          language: "ar", // Set the editor's language to Arabic
        }}
        onEditorChange={(content) => {
          setDescription(content);
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;
