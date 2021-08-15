import { Fragment, useState } from "react";
import "./FileUpload.css";
import { Link } from "react-router-dom";
import { create } from "ipfs-http-client";
import Card from "../components/Card";
import LoadingSpinner from "./LoadingSpinner";
import download from "../images/download.png";
const Cryptr = require("cryptr");
const client = create("https://ipfs.infura.io:5001/api/v0");

const FileUpload = (props) => {
  const [name, setName] = useState("");
  const [filename, setFilename] = useState("Choose a File");
  const [file, setFile] = useState("");
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);
  const [modal, setModal] = useState(false);

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const formSubmission = async (e) => {
    e.preventDefault();
    if (!password === cpassword && name && file) {
      console.log("not met");
      return;
    }
    setUploading(true);
    const cryptr = new Cryptr(cpassword);
    try {
      const options = {
        wrapWithDirectory: true,
      };
      const files = [{ path: filename, content: file }];
      const added = await client.add(files, options);
      const url = `https://ipfs.infura.io/ipfs/${added.cid.toString()}/${filename}`;
      console.log(url);
      const encryptedString = cryptr.encrypt(url);
      setLink(encryptedString);
      setMessage("File Uploaded");
    } catch (error) {
      console.log("Error uploading file: ", error);
      setMessage(error);
    }
    setTimeout(() => setMessage(""), 10000);
    setName("");
    setCPassword("");
    setPassword("");
    setFilename("Choose a file");
    setFile("");
    setUploading(false);
    setModal(true);
  };

  const nameChangeHandler = (event) => {
    setName(event.target.value);
  };

  const passwordChangeHandler = (event) => {
    setPassword(event.target.value);
  };

  const cpasswordChangeHandler = (event) => {
    setCPassword(event.target.value);
  };
  const modalChangeHandler = () => {
    setModal(false);
  };

  return (
    <Fragment>
      {uploading && <LoadingSpinner />}
      {modal && <Card onClose={modalChangeHandler} link={link} />}
      <div className="updown">
        <form onSubmit={formSubmission} className="form-down">
          <div class="row">
            <h2 class="details">Details</h2>
            <div class="input_field authtitle">
              <input
                type="text"
                id="fname"
                name="fname"
                placeholder="File Name"
                required="true"
                onChange={nameChangeHandler}
                value={name}
              />
            </div>
          </div>
          <div class="row">
            <h2 class="details">Password</h2>
            <div class="input_field">
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                required="true"
                onChange={passwordChangeHandler}
                value={password}
              />
            </div>
          </div>

          <div class="row">
            <input
              type="submit"
              value="Download"
              class="btn"
              disabled={!password === cpassword && name}
            ></input>
            <Link to="/" class="btn">
              Cancel
            </Link>
          </div>
        </form>
        <div className="img-con">
          <img src={download} alt="upload" className="down-img" />
          <div class="row">
            <div class="input_field">
              {/* <h1>Upload Files</h1> */}
            </div>
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="customFile"
                onChange={onChange}
              />
              {/* <label for="customFile">{filename}</label> */}
            </div>
          </div>
        </div>
      </div>
      <p>{message}</p>
    </Fragment>
  );
};

export default FileUpload;