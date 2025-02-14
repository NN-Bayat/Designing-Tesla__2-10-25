const topBar = document.getElementById("top-bar");
let lastScrollY = window.scrollY;
const exteriorColorsSection = document.querySelector("#exterior-buttons");
const interiorColorsSection = document.querySelector("#interior-buttons");
const exteriorImage = document.querySelector("#exterior-image");
const interiorImage = document.querySelector("#interior-image");
const wheelButtonsSection = document.querySelector("#wheel-buttons");
const performanceButton = document.querySelector("#performance-btn");
const totalPriceElement = document.getElementById("total-price");
const fullSelfDrivingCheckbox = document.getElementById(
  "full-self-driving-checkbox"
);
const accessoryCheckboxes = document.querySelectorAll(
  ".accessory-form-checkbox"
);
const downPaymentElement = document.getElementById("down-payment");
const monthlyPaymentElement = document.getElementById("monthly-payment");

// Base car price
let basePrice = 52490;
let currentPrice = basePrice;

// State to track selected options
let selectedOptions = {
  "Performance Wheels": false,
  "Performance Package": false,
  "Full Self-Driving": false,
};

// Pricing for individual options
const pricing = {
  "Performance Wheels": 2500,
  "Performance Package": 5000,
  "Full Self-Driving": 8500,
  Accessories: {
    "Center Console Trays": 35,
    Sunshade: 105,
    "All-Weather Interior Liners": 225,
  },
};

// Update total price on the UI
const updateTotalPrice = () => {
  // Reset the price to base and recalculate with selected options
  currentPrice = basePrice;

  if (selectedOptions["Performance Wheels"]) {
    currentPrice += pricing["Performance Wheels"];
  }
  if (selectedOptions["Performance Package"]) {
    currentPrice += pricing["Performance Package"];
  }
  if (selectedOptions["Full Self-Driving"]) {
    currentPrice += pricing["Full Self-Driving"];
  }

  // Add any selected accessories prices
  accessoryCheckboxes.forEach((checkbox) => {
    const accessoryLabel = checkbox
      .closest("label")
      .querySelector("span")
      .textContent.trim();
    const accessoryPrice = pricing["Accessories"][accessoryLabel];

    if (checkbox.checked) {
      currentPrice += accessoryPrice;
    }
  });

  // Update the total price on the UI
  totalPriceElement.textContent = `$${currentPrice.toLocaleString()}`;

  // Update payment breakdown
  updatePaymentBreakdown();
};

// Update payment breakdown based on current price
const updatePaymentBreakdown = () => {
  // Calculate down payment (10% of the total price)
  const downPayment = currentPrice * 0.1;
  downPaymentElement.textContent = `$${downPayment.toLocaleString()}`;

  // Calculate loan details (assuming 60-month loan and 3% interest rate)
  const loanTermMonths = 60;
  const interestRate = 0.03; // 3% APR

  // Loan amount is total price minus down payment
  const loanAmount = currentPrice - downPayment;

  // Monthly payment formula: P * (r(1+r)^n) / ((1+r)^n - 1)
  const monthlyInterestRate = interestRate / 12;
  const monthlyPayment =
    (loanAmount *
      (monthlyInterestRate *
        Math.pow(1 + monthlyInterestRate, loanTermMonths))) /
    (Math.pow(1 + monthlyInterestRate, loanTermMonths) - 1);

  // Update monthly payment on the UI
  monthlyPaymentElement.textContent = `$${monthlyPayment
    .toFixed(2)
    .toLocaleString()}`;
};

// Handle Top Bar Hide/Show on Scroll
const handleScroll = () => {
  const atTop = window.scrollY === 0;
  topBar.classList.toggle("visible-bar", atTop);
  topBar.classList.toggle("hidden-bar", !atTop);
};

// Image mapping
const exteriorImages = {
  "Stealth Grey":
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862379/tesla-project/model-y-stealth-grey_jdkqen.jpg",
  "Pearl White":
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862385/tesla-project/model-y-pearl-white_j6hrbj.jpg",
  "Deep Blue":
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862384/tesla-project/model-y-deep-blue-metallic_e9oaqj.jpg",
  "Solid Black":
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862379/tesla-project/model-y-solid-black_dtzahk.jpg",
  "Ultra Red":
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862380/tesla-project/model-y-ultra-red_wcat8t.jpg",
  Quicksilver:
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862388/tesla-project/model-y-quicksilver_lasxqa.jpg",
};

const interiorImages = {
  Dark: "https://res.cloudinary.com/traversy-dev/image/upload/v1729862385/tesla-project/model-y-interior-dark_vhr1zd.jpg",
  Light:
    "https://res.cloudinary.com/traversy-dev/image/upload/v1729862386/tesla-project/model-y-interior-light_wtfat9.jpg",
};

// Handle Color Selection
const handleColorButtonClick = (event) => {
  let button;

  if (event.target.tagName === "IMG") {
    button = event.target.closest("button");
  } else if (event.target.tagName === "BUTTON") {
    button = event.target;
  }

  if (button) {
    const buttons = event.currentTarget.querySelectorAll("button");
    buttons.forEach((btn) => btn.classList.remove("btn-selected"));
    button.classList.add("btn-selected");

    // Change exterior image
    if (event.currentTarget === exteriorColorsSection) {
      const color = button.querySelector("img").alt; // Get the alt text of the image
      exteriorImage.src = exteriorImages[color]; // Update the exterior image source
    }

    // Change interior image
    if (event.currentTarget === interiorColorsSection) {
      const color = button.querySelector("img").alt; // Get the alt text of the image
      interiorImage.src = interiorImages[color]; // Update the interior image source
    }
  }
};

// Wheel Selection
const handleWheelButtonClick = (event) => {
  if (event.target.tagName === "BUTTON") {
    const buttons = document.querySelectorAll("#wheel-buttons button");
    buttons.forEach((btn) => btn.classList.remove("bg-gray-700", "text-white"));

    // Add selected styles to the clicked button
    event.target.classList.add("bg-gray-700", "text-white");

    // Change the car image based on the selected wheel
    const selectedWheel = event.target.textContent.includes("Performance");
    // Update car image based on wheel selection
    exteriorImage.src = selectedWheel
      ? "https://res.cloudinary.com/traversy-dev/image/upload/v1729862380/tesla-project/model-y-stealth-grey-performance_xrjhfd.jpg"
      : "https://res.cloudinary.com/traversy-dev/image/upload/v1729862379/tesla-project/model-y-stealth-grey_jdkqen.jpg";

    // Update the selectedOptions
    selectedOptions["Performance Wheels"] = selectedWheel;

    // Update price
    updateTotalPrice();
  }
};

// Performance Package Selection
const handlePerformanceButtonClick = (event) => {
  const isSelected = performanceButton.classList.toggle("bg-gray-700");
  performanceButton.classList.toggle("text-white");

  // Update selected options
  selectedOptions["Performance Package"] = isSelected;

  // Update price
  updateTotalPrice();
};

// Full Self-Driving Selection
const fullSelfDrivingChange = () => {
  const isSelected = fullSelfDrivingCheckbox.checked;
  fullSelfDrivingCheckbox.checked = isSelected;
  selectedOptions["Full Self-Driving"] = isSelected;
  updateTotalPrice();
};

// Handle Accessories Selection
accessoryCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", (event) => {
    updateTotalPrice(); // Just recalculate the total
  });
});

// Initial total price update
updateTotalPrice();

// Event listeners
window.addEventListener("scroll", handleScroll);
exteriorColorsSection.addEventListener("click", handleColorButtonClick);
interiorColorsSection.addEventListener("click", handleColorButtonClick);
wheelButtonsSection.addEventListener("click", handleWheelButtonClick);
performanceButton.addEventListener("click", handlePerformanceButtonClick);
fullSelfDrivingCheckbox.addEventListener("change", fullSelfDrivingChange);
