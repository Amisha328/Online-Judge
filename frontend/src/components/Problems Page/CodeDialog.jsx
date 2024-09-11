import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { ToastContainer, toast } from "react-toastify";

const CodeDialog = ({ show, handleClose, code, language }) => {

  const handleCopy = () =>{
    navigator.clipboard.writeText(code).then(() =>{
      toast("Code copied to clipboard!", { position: "top-right" });
    }).catch((error) => {
      toast("Failed to copy to clipboard", { position: "top-right" });
    })
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Last Submitted Code in {language}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="bg-light p-3 editor-wrapper">
          <Editor
            value={code}
            highlight={(code) => highlight(code, languages[language] || languages.js)}
            padding={10}
            style={{
              fontFamily: '"Fira code", "Fira Mono", monospace',
              fontSize: 14,
              outline: 'none',
              border: 'none',
              minHeight: '200px',
              overflow: 'auto',
            }}
            readOnly
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCopy}>
          Copy
        </Button>
      </Modal.Footer>
      <ToastContainer />
    </Modal>
  );
};

export default CodeDialog;
