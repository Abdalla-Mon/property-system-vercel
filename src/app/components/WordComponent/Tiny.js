import { useEffect, useRef } from "react";

const TinyMCEEditor = ({ description, setDescription }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    // Load TinyMCE script dynamically
    const script = document.createElement("script");
    script.src = "/tinymce/tinymce.min.js";
    script.async = true;
    script.onload = () => {
      tinymce.init({
        selector: "textarea",
        height: "29.5cm",
        directionality: "rtl",
        menubar: "file edit insert view format table tools",
        fontsize_formats: "8pt 10pt 12pt 14pt 18pt 24pt 36pt",
        setup: (editor) => {},
        content_style: `
          .bordered-content { border: 2px solid black; padding: 0; }
          body { direction: rtl; text-align: right; width: 25.5cm; }
          p, div, h1, h2, h3, h4, h5, h6, span { direction: rtl; text-align: right; }
        `,
        language: "ar",
      });
      return () => {
        tinymce.remove(editorRef.current);
      };
    };

    document.body.appendChild(script);
  }, []);

  return (
    <div style={{ margin: "auto", width: "20.2cm" }}>
      <textarea
        ref={editorRef}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>
  );
};

export default TinyMCEEditor;
