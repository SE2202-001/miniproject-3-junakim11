class Job {
  constructor(Title, Posted, Type, Level, Skill, Detail) {
    this.Title = Title;
    this.Posted = Posted;
    this.Type = Type;
    this.Level = Level;
    this.Skill = Skill;
    this.Detail = Detail;
  }
  list() {
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job");
    jobDiv.innerHTML = `<div style="padding:10px; border-bottom: solid rgb(224, 224, 224);">${this.Title}</div>`;
    document.getElementById("job-list").appendChild(jobDiv);
  }
  display() {
    console.log(`Job Title: ${this.Title}`);
    console.log(`Type: ${this.Type}`);
    console.log(`Level: ${this.Level}`);
    console.log(`Skill: ${this.Skill}`);
    console.log(`Description: ${this.Detail}`);
    console.log(`Posted: ${this.Posted}`);
  }
  getPostedOriginal() {
    return this.Posted;
  }
  getPostedMin() {
    if (typeof this.Posted === "string") {
      let array = this.Posted.split(" ");
      if (array[1] === "minutes") {
        let postedMin = Number(array[0]);
        this.postedMin = postedMin;
      } else {
        let postedMin = Number(array[0]);
        this.postedMin = postedMin * 60;
      }
    } else {
      console.error("Error: Posted is not a string:", this.Posted);
    }
  }
}

let data;
let jobs;

function filterByLevel(level) {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";
  const filtered = jobs.filter((job) => job.Level === level);
  filtered.forEach((job) => job.list());
}
function filterByType(type) {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";
  const filtered = jobs.filter((job) => job.Type === type);
  filtered.forEach((job) => job.list());
}
function filterBySkill(skill) {
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";
  const filtered = jobs.filter((job) => job.Skill === skill);
  filtered.forEach((job) => job.list());
}
function select(selectedTitle) {
  return jobs.find((job) => job.Title == selectedTitle);
}
document.getElementById("file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
    data = JSON.parse(e.target.result);
    jobs = data.map(
      (jobData) =>
        new Job(
          jobData.Title,
          jobData.Posted,
          jobData.Type,
          jobData.Level,
          jobData.Skill,
          jobData.Detail
        )
    );
    jobs.forEach((job) => job.list());
    const levels = [...new Set(data.map((job) => job.Level))];
    levels.forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level;
      document.getElementById("level").appendChild(option);
    });
    const types = [...new Set(data.map((job) => job.Type))];
    types.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type;
      document.getElementById("type").appendChild(option);
    });
    const skills = [...new Set(data.map((job) => job.Skill))];
    skills.forEach((skill) => {
      const option = document.createElement("option");
      option.value = skill;
      option.textContent = skill;
      document.getElementById("skill").appendChild(option);
    });
    jobs.forEach((job) => job.getPostedMin());
  };
  reader.readAsText(file);
});

document.getElementById("job-list").addEventListener("click", function (event) {
  const selected = event.target.textContent;
  const selectedJob = select(selected);
  alert(`Title: ${selectedJob.Title}\nType: ${selectedJob.Type}\nLevel: ${selectedJob.Level}\nSkill: ${selectedJob.Skill}\nDescription: ${selectedJob.Detail}\nPosted: ${selectedJob.Posted}`);
});

document.getElementById("filter-submit").addEventListener("click", function () {
  const selectedLevel = document.getElementById("level").value;
  if (selectedLevel) {
    filterByLevel(selectedLevel);
  } else {
    jobs.forEach((job) => job.list()); // Show all jobs if no skill is selected
  }
  const selectedType = document.getElementById("type").value;
  if (selectedType) {
    filterByType(selectedType);
  } else {
    jobs.forEach((job) => job.list()); // Show all jobs if no skill is selected
  }
  const selectedSkill = document.getElementById("skill").value;
  if (selectedSkill) {
    filterBySkill(selectedSkill);
  } else {
    jobs.forEach((job) => job.list()); // Show all jobs if no skill is selected
  }
});

document.getElementById("sort-submit").addEventListener("click", function () {
  const sorted = document.getElementById("sort").value;
  const jobList = document.getElementById("job-list");
  jobList.innerHTML = "";
  if (sorted === "sortAlpha") {
    jobs.sort((a, b) => a.Title.localeCompare(b.Title));
    jobs.forEach((job) => job.list());
  } else if (sorted === "sortReverseAlpha") {
    jobs.reverse((a, b) => a.Title.localeCompare(b.Title)); 
    jobs.forEach((job) => job.list());
  } else if (sorted === "sortPostedOldest") {
    jobs.reverse((a, b) => a.postedMin.localeCompare(b.postedMin));
    jobs.forEach((job) => job.list());
  } else if (sorted === "sortPostedNewest") {
    jobs.reverse((a, b) => b.postedMin.localeCompare(a.postedMin));
    jobs.forEach((job) => job.list());
  } else {
    jobs.forEach((job) => job.list()); // Show all jobs if no skill is selected
  }
});
