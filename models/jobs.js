const mongoose = require('mongoose');

const appliSchema = new mongoose.Schema({
  applicant: {type: String, default: 'nothing'}
})


const jobSchema = new mongoose.Schema({
  userid: {type: String, required: true},
  job_tittle: {type: String, required: true},
  job_location: {type: String, required: true},
  job_salary: {type: String, defualt: "Not mentioned"},
  job_type: {type: String, defualt: "Full Time"},
  job_level: {type: String, defualt: "Entry Level"},
  job_des: {type: String, required: true},

  job_edu:{type: String, required: true},
  job_exp_level: {type: String, defualt: "0"},

  job_deadline: {type: Date, required: true},
  job_app_email: {type: String, required: true},
  job_resume: {type: String, defualt: "Yes" },

  job_company_name: {type: String, required: true},
  job_company_website: {type: String, defualt: "No url provided"},
  job_company_des: {type: String, required: true},
  job_contact_info: {type: String, required: true},
  job_company_logo: {type: String, defualt: 'test'},

  applicants: {type: [appliSchema], default: []}
})




module.exports = mongoose.model('job', jobSchema);