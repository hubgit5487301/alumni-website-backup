const mongoose = require('mongoose');

const DetailsSchema = new mongoose.Schema({
  batch: {type: String, required: true},
  branch: { type: String, required: true},
  aboutme: {type: String, default: 'No input provided'},
  education: {type: String, default: 'No input provided'},
  currentrole: {type: String, default: 'No input provided'},
  experience: {type: String, default: 'No input provided'},
  contactinfo: {type: String, default: 'No input provided',},
  resume: {type: String, default: 'empty'},
})

const job_ids = new mongoose.Schema({
  job_id: {type: String, default: 'no data'}
})

const event_ids = new mongoose.Schema ({
  event_id: {type: String, default: 'no data'}
})

const dataSchema = new mongoose.Schema({
  job_ids: { type: [job_ids], default: []},
  event_ids: { type: [event_ids], default: []}
})

const userSchema = mongoose.Schema({
  personname: { type: String, required: true},
  userid: { type: String, required: true},
  usertype: {type: String, required: true},
  email: { type: String, required: true},
  userprivacy: {type: String, required: true, default: 'public'},
  salt: {type: String, required: true},
  passwordhash: { type: String, required: true},
  personimage: {type: String, default: 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KDTwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIFRyYW5zZm9ybWVkIGJ5OiBTVkcgUmVwbyBNaXhlciBUb29scyAtLT4KPHN2ZyB3aWR0aD0iODAwcHgiIGhlaWdodD0iODAwcHgiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBzdHJva2U9IiNmZmZmZmYiPgoNPGcgaWQ9IlNWR1JlcG9fYmdDYXJyaWVyIiBzdHJva2Utd2lkdGg9IjAiLz4KDTxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgoNPGcgaWQ9IlNWR1JlcG9faWNvbkNhcnJpZXIiPiA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjAwMDEgMS4yNUM5LjM3Njc4IDEuMjUgNy4yNTAxMyAzLjM3NjY1IDcuMjUwMTMgNkM3LjI1MDEzIDguNjIzMzUgOS4zNzY3OCAxMC43NSAxMi4wMDAxIDEwLjc1QzE0LjYyMzUgMTAuNzUgMTYuNzUwMSA4LjYyMzM1IDE2Ljc1MDEgNkMxNi43NTAxIDMuMzc2NjUgMTQuNjIzNSAxLjI1IDEyLjAwMDEgMS4yNVpNOC43NTAxMyA2QzguNzUwMTMgNC4yMDUwNyAxMC4yMDUyIDIuNzUgMTIuMDAwMSAyLjc1QzEzLjc5NTEgMi43NSAxNS4yNTAxIDQuMjA1MDcgMTUuMjUwMSA2QzE1LjI1MDEgNy43OTQ5MyAxMy43OTUxIDkuMjUgMTIuMDAwMSA5LjI1QzEwLjIwNTIgOS4yNSA4Ljc1MDEzIDcuNzk0OTMgOC43NTAxMyA2WiIgZmlsbD0iI2ZmZmZmZiIvPiA8cGF0aCBmaWxsLXJ1bGU9ImV2ZW5vZGQiIGNsaXAtcnVsZT0iZXZlbm9kZCIgZD0iTTEyLjAwMDEgMTIuMjVDOS42ODY1OCAxMi4yNSA3LjU1NTA2IDEyLjc3NTkgNS45NzU1OCAxMy42NjQzQzQuNDE5NjIgMTQuNTM5NiAzLjI1MDEzIDE1Ljg2NjEgMy4yNTAxMyAxNy41TDMuMjUwMDcgMTcuNjAyQzMuMjQ4OTQgMTguNzYzOCAzLjI0NzUyIDIwLjIyMiA0LjUyNjU1IDIxLjI2MzVDNS4xNTYwMiAyMS43NzYxIDYuMDM2NjEgMjIuMTQwNiA3LjIyNjM0IDIyLjM4MTVDOC40MTk0IDIyLjYyMjkgOS45NzQzNiAyMi43NSAxMi4wMDAxIDIyLjc1QzE0LjAyNTkgMjIuNzUgMTUuNTgwOSAyMi42MjI5IDE2Ljc3MzkgMjIuMzgxNUMxNy45NjM3IDIyLjE0MDYgMTguODQ0MyAyMS43NzYxIDE5LjQ3MzcgMjEuMjYzNUMyMC43NTI3IDIwLjIyMiAyMC43NTEzIDE4Ljc2MzggMjAuNzUwMiAxNy42MDJMMjAuNzUwMSAxNy41QzIwLjc1MDEgMTUuODY2MSAxOS41ODA3IDE0LjUzOTYgMTguMDI0NyAxMy42NjQzQzE2LjQ0NTIgMTIuNzc1OSAxNC4zMTM3IDEyLjI1IDEyLjAwMDEgMTIuMjVaTTQuNzUwMTMgMTcuNUM0Ljc1MDEzIDE2LjY0ODcgNS4zNzE1MSAxNS43MjUxIDYuNzEwOTggMTQuOTcxN0M4LjAyNjkzIDE0LjIzMTUgOS44OTU0MSAxMy43NSAxMi4wMDAxIDEzLjc1QzE0LjEwNDkgMTMuNzUgMTUuOTczMyAxNC4yMzE1IDE3LjI4OTMgMTQuOTcxN0MxOC42Mjg4IDE1LjcyNTEgMTkuMjUwMSAxNi42NDg3IDE5LjI1MDEgMTcuNUMxOS4yNTAxIDE4LjgwNzggMTkuMjA5OCAxOS41NDQgMTguNTI2NSAyMC4xMDA0QzE4LjE1NiAyMC40MDIyIDE3LjUzNjYgMjAuNjk2NyAxNi40NzYzIDIwLjkxMTNDMTUuNDE5NCAyMS4xMjUyIDEzLjk3NDQgMjEuMjUgMTIuMDAwMSAyMS4yNUMxMC4wMjU5IDIxLjI1IDguNTgwODcgMjEuMTI1MiA3LjUyMzkzIDIwLjkxMTNDNi40NjM2NiAyMC42OTY3IDUuODQ0MjUgMjAuNDAyMiA1LjQ3MzcyIDIwLjEwMDRDNC43OTA0NSAxOS41NDQgNC43NTAxMyAxOC44MDc4IDQuNzUwMTMgMTcuNVoiIGZpbGw9IiNmZmZmZmYiLz4gPC9nPgoNPC9zdmc+'},
  details: {type: DetailsSchema, required: true, default: () => ({})},
  data: {type: dataSchema, default: ( )=> ({})},
  verified: {type: Boolean, default: false}
})





module.exports = mongoose.model('Alumni', userSchema);
