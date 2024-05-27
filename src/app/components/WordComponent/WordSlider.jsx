import React, { useEffect, useState } from "react";
import { WordComponent } from "./WordComponent";
import "./quill-custom.css";

export const WordSlider = ({ description, setDescription }) => {
  const [newPage, setNewPage] = useState(false);
  const handleDeletePage = (index, e) => {
    e.preventDefault();
    const newDescription = [...description];
    newDescription.splice(index, 1);
    setDescription(newDescription);
  };
  useEffect(() => {
    if (newPage) {
      setDescription([...description, { id: description.length, content: "" }]);
      setNewPage(false);
    }
  }, [newPage]);
  return (
    <>
      <div>
        <div>
          <div className={"overflow-x-auto"}>
            {description.map((desc, index) => {
              return (
                <>
                  <WordComponent
                    key={desc.id}
                    description={description}
                    setDescription={setDescription}
                    index={index}
                    setNewPage={setNewPage}
                  />
                  <div className={"flex justify-center"}>
                    <button
                      onClick={(e) => handleDeletePage(index, e)}
                      className="delete-page-button  mx-auto mt-4 mb-4 bg-red-500 text-white p-2 rounded-md text-center"
                    >
                      Delete Page
                    </button>
                  </div>
                </>
              );
            })}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              setNewPage(true);
            }}
            className="mx-auto mt-4 mb-4 bg-green-500 text-white p-2 rounded-md text-center"
          >
            Add Page
          </button>
        </div>
      </div>
    </>
  );
};
