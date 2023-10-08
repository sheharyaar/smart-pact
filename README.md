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
  - [X] Fetch templates
  - [X] Add timeout for oauth in both popup and button
  - [X] Seperate oauth into a component

- OpenAI
  - [ ] Generate content and programatically add them to the pdf
  - [X] Ability to fetch the text available (annotations) and reviewing them

- DashBoard
  - [X] Add ability to add page and templates

- Timeline
  - [ ] Check the representation of annoations (save in a suitable format in cloud with diff)
  - [ ] Add them together somehow and generate a pdf id.

- PDF Loading and Saving
  - [X] Save as Arraybuffer and then send to the python backend for local saving
  - [X] Save json for present annotations for history
  - [ ] Save also in localstorage for fast access, if not found request from server
  - [ ] Hash the buffer into a checksum  and send to DB for later fetching


Ideas :
- [ ] Translation of Contracts
- [X] Summary of Contract
- [ ] Question Answer format for Contracts
- [ ] Collaborative pdf editor