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
    try {
      const jobDiv = document.createElement("div");
      jobDiv.classList.add("job");
      jobDiv.innerHTML = `<div style="padding:10px; border-bottom: solid rgb(224, 224, 224);">${this.Title}</div>`;
      document.getElementById("job-list").appendChild(jobDiv);
    } catch (error) {
      console.error("Error displaying job list: ", error);
    }
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
    try {
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
    } catch (error) {
      console.error("Error: Can't parse Posted, ", error);
    }
  }
}

let data;
let jobs;
let filtered;
function listing(jobList) {
  clearJobList();
  if (jobList.length != 0) {
    jobList.forEach((job) => job.list());
  } else {
    const jobDiv = document.createElement("div");
    jobDiv.classList.add("job");
    jobDiv.innerHTML = `<div style="padding:10px;">No jobs available</div>`;
    document.getElementById("job-list").appendChild(jobDiv);
  }
}
function clearJobList() {
  document.getElementById("job-list").innerHTML = "";
}
function filterByLevel(level) {
   filtered = jobs.filter((job) => job.Level === level);
  listing(filtered);
}
function filterByType(type) {
   filtered = jobs.filter((job) => job.Type === type);
  listing(filtered);
}
function filterBySkill(skill) {
   filtered = jobs.filter((job) => job.Skill === skill);
  listing(filtered);
}
function filterByLevelType(level, type) {
   filtered = jobs.filter(
    (job) => job.Level === level && job.Type === type
  );
  listing(filtered);
}
function filterByLevelSkill(level, skill) {
   filtered = jobs.filter(
    (job) => job.Level === level && job.Skill === skill
  );
  listing(filtered);
}
function filterByTypeSkill(type, skill) {
   filtered = jobs.filter(
    (job) => job.Type === type && job.Skill === skill
  );
  listing(filtered);
}
function filterByAll(type, skill, level) {
   filtered = jobs.filter(
    (job) => job.Level === level && job.Type === type && job.Skill === skill
  );
  listing(filtered);
}

function filterMenu(id, menus) {
  menus.forEach((menu) => {
    const option = document.createElement("option");
    option.value = menu;
    option.textContent = menu;
    document.getElementById(id).appendChild(option);
  });
}
let original;
document.getElementById("file").addEventListener("change", function (event) {
  const file = event.target.files[0];
  if (!file) {
    console.log("No file!");
    return;
  }
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
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
      listing(jobs);

      const levels = [...new Set(data.map((job) => job.Level))];
      filterMenu("level", levels);
      const types = [...new Set(data.map((job) => job.Type))];
      filterMenu("type", types);
      const skills = [...new Set(data.map((job) => job.Skill))];
      filterMenu("skill", skills);

      jobs.forEach((job) => job.getPostedMin());

      document.getElementById("filters").style.display = "flex";
      document.getElementById("sorts").style.display = "flex";

    } catch (error) {
      console.error("Error in getting the job list: ", error);
      alert("The file chosen is not appropriate or does not exist!\nPlease choose another one.");
    }
  };
  reader.readAsText(file);
});

document.getElementById("job-list").addEventListener("click", function (event) {
  try {
    const selected = event.target.textContent;
    const selectedJob = jobs.find((job) => job.Title == selected);
    alert(
      `Title: ${selectedJob.Title}\nType: ${selectedJob.Type}\nLevel: ${selectedJob.Level}\nSkill: ${selectedJob.Skill}\nDescription: ${selectedJob.Detail}\nPosted: ${selectedJob.Posted}`
    );
  } catch (error) {
    console.error("Error: Can't select this job,", error);
  }
});

document.getElementById("filter-submit").addEventListener("click", function () {
  const selectedLevel = document.getElementById("level").value;
  if (selectedLevel) {
    filterByLevel(selectedLevel);
  }
  const selectedType = document.getElementById("type").value;
  if (selectedType) {
    filterByType(selectedType);
  }
  const selectedSkill = document.getElementById("skill").value;
  if (selectedSkill) {
    filterBySkill(selectedSkill);
  }

  if (selectedLevel && selectedType) {
    filterByLevelType(selectedLevel, selectedType);
  }
  if (selectedLevel && selectedSkill) {
    filterByLevelSkill(selectedLevel, selectedSkill);
  }
  if (selectedType && selectedSkill) {
    filterByTypeSkill(selectedType, selectedSkill);
  }
  if (selectedType && selectedSkill && selectedLevel) {
    filterByAll(selectedType, selectedSkill, selectedLevel);
  }

  if (!selectedLevel && !selectedSkill && !selectedType) {
    listing(jobs); // Show all jobs if no filter is selected
  }
});

document.getElementById("sort-submit").addEventListener("click", function () {
  const sorted = document.getElementById("sort").value;

  try {
    if (sorted === "sortAlpha") {
      filtered.sort((a, b) => a.Title.localeCompare(b.Title));
    } else if (sorted === "sortReverseAlpha") {
      filtered.reverse((a, b) => a.Title.localeCompare(b.Title));
    } else if (sorted === "sortPostedOldest") {
      filtered.sort((a, b) => b.postedMin - a.postedMin);
    } else if (sorted === "sortPostedNewest") {
      filtered.sort((a, b) => a.postedMin - b.postedMin);
    }

    listing(filtered);
  } catch (error) {
    console.error("Error: Can't sort the jobs, ", error);
  }
});
