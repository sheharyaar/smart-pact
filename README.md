# Steps to run

- First run the backlend,it is located under backend folder. See the setups to run in that folder's README

- To run frontend :
```shell
# use node version 18

# if you are using nvm to manage node version do ;
nvm use 18

#then 
npm install
npm start
```

# TODO

- [x] Modify Toolbar and add custom signature option

- HelloSign
  - [ ] Fetch Signature
  - [ ] Fetch templates
  - [ ] Refresh the token
  - [ ] Add timeout for oauth in both popup and button
  - [ ] Seperate oauth into a component

- HuggingFace
  - [ ] Find a good document model
  - [ ] Train the model according to the SDK
  - [x] Generate content and programatically add them to the pdf
  - [ ] Ability to fetch the text available (annotations) and reviewing them

- DashBoard
  - [ ] Add ability to add page and templates
  - [ ] In the two sections (created and shared), for shared show a red dot (with a number ??) for unread shared docs
  - [ ] Add 3 dots to star, download, delete a pdf

- Timeline
  - [ ] Check the representation of annoations (save in a suitable format in cloud with diff)
  - [ ] Add them together somehow and generate a pdf id.

- PDF Loading and Saving
  - [ ] Save as Arraybuffer and then send to the python backend for local saving
  - [ ] Save json for present annotations for history
  - [ ] Save also in localstorage for fast access, if not found request from server
  - [ ] Hash the buffer into a checksum  and send to DB for later fetching


Ideas :
- [ ] Translation of Contracts
- [ ] Summary of Contract
- [ ] Question Answer format for Contracts
- [ ] Collaborative pdf editor