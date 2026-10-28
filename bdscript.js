
const form = document.getElementById("donorForm");
const steps = document.querySelectorAll(".step");

const nextBtn = document.getElementById("nextBtn");
const backBtn = document.getElementById("backBtn");
const submitBtn = document.getElementById("submitBtn");

const progressBar = document.getElementById("progressBar");
const stepText = document.getElementById("stepText");
const errorMessage = document.getElementById("errorMessage");

const thankYou = document.getElementById("thankYou");
const pageCard = document.querySelector(".card");

let currentStep = 0;

function showStep(index) {
  steps.forEach((step, i) => {
    step.classList.toggle("active", i === index);
  });

  currentStep = index;

  stepText.textContent = `Step ${index + 1} of ${steps.length}`;
  progressBar.style.width =
    `${((index + 1) / steps.length) * 100}%`;

  backBtn.hidden = index === 0;
  nextBtn.hidden = index === steps.length - 1;
  submitBtn.hidden = index !== steps.length - 1;

  errorMessage.textContent = "";
}

function validateCurrentStep() {
  const fields = steps[currentStep].querySelectorAll(
    "input:not([type='checkbox']), select, textarea"
  );

  for (const field of fields) {
    if (!field.checkValidity()) {
      field.reportValidity();
      return false;
    }
  }

  if (currentStep === 1) {
    const phone = document.getElementById("phone").value.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      errorMessage.textContent =
        "Enter a valid 10-digit mobile number.";
      return false;
    }
  }

  return true;
}

nextBtn.addEventListener("click", () => {
  if (!validateCurrentStep()) return;

  if (currentStep < steps.length - 1) {
    showStep(currentStep + 1);
  }
});

backBtn.addEventListener("click", () => {
  if (currentStep > 0) {
    showStep(currentStep - 1);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateCurrentStep()) return;

  if (!document.getElementById("consent").checked) {
    errorMessage.textContent =
      "Please confirm that your details are correct.";
    return;
  }

  document.getElementById("donorName").textContent =
    document.getElementById("name").value.trim();

  document.getElementById("donorGroup").textContent =
    document.getElementById("bloodGroup").value;

  form.hidden = true;
  stepText.hidden = true;
  document.querySelector(".progress").hidden = true;
  thankYou.hidden = false;

  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.getElementById("downloadBtn").addEventListener("click", () => {
  if (!window.jspdf) {
    alert("PDF library load aagala. Internet connection check pannunga.");
    return;
  }

  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const name = document.getElementById("name").value.trim();
  const bloodGroup = document.getElementById("bloodGroup").value;
  const date = new Date().toLocaleDateString("en-IN");

  pdf.setDrawColor(190, 25, 48);
  pdf.setLineWidth(1.5);
  pdf.rect(10, 10, 190, 277);

  pdf.setTextColor(190, 25, 48);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text("THANK YOU!", 105, 42, { align: "center" });

  pdf.setFontSize(17);
  pdf.text("Blood Donor Registration", 105, 56, {
    align: "center"
  });

  pdf.setTextColor(50, 50, 50);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(13);
  pdf.text("This certificate of appreciation is presented to", 105, 85, {
    align: "center"
  });

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text(name, 105, 105, { align: "center" });

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(13);
  pdf.text("For registering as a prospective blood donor.", 105, 125, {
    align: "center"
  });

  pdf.text(`Blood Group: ${bloodGroup}`, 105, 145, {
    align: "center"
  });

  pdf.text(`Registration Date: ${date}`, 105, 160, {
    align: "center"
  });

  pdf.setFontSize(10);
  pdf.text(
    "Demo project certificate — not proof of an actual blood donation.",
    105, 205, { align: "center", maxWidth: 165 }
  );

  pdf.text("Blood Donation Portal | Project ID: 26BCR031", 105, 265, {
    align: "center"
  });

  const safeName = name.replace(/[^a-z0-9]/gi, "_");
  pdf.save(`${safeName}_Registration_Certificate.pdf`);
});

document.getElementById("restartBtn").addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  thankYou.hidden = true;
  stepText.hidden = false;
  document.querySelector(".progress").hidden = false;

  showStep(0);
  window.scrollTo({ top: 0, behavior: "smooth" });
});

showStep(0);
